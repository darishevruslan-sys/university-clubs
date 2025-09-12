const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
require('dotenv').config({ path: './config.env' });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://university-clubs.vercel.app', 'https://university-clubs.netlify.app'] 
    : 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Только изображения разрешены!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Serve static files
app.use('/uploads', express.static('uploads'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Serve static files from React build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
}

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/university-clubs', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB подключена успешно');
}).catch((error) => {
  console.error('Ошибка подключения к MongoDB:', error.message);
  console.log('Приложение будет работать без базы данных');
});

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  joinedClubs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Club' }],
  createdAt: { type: Date, default: Date.now }
});

// Club Schema
const clubSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

// Message Schema
const messageSchema = new mongoose.Schema({
  club: { type: mongoose.Schema.Types.ObjectId, ref: 'Club', required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// News Schema
const newsSchema = new mongoose.Schema({
  club: { type: mongoose.Schema.Types.ObjectId, ref: 'Club', required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  images: [{ type: String }], // Array of image file paths
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Club = mongoose.model('Club', clubSchema);
const Message = mongoose.model('Message', messageSchema);
const News = mongoose.model('News', newsSchema);

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Токен доступа не предоставлен' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Недействительный токен' });
    }
    req.user = user;
    next();
  });
};

// Routes

// Register
app.post('/api/register', [
  body('name').notEmpty().withMessage('Имя обязательно'),
  body('email').isEmail().withMessage('Некорректный email'),
  body('password').isLength({ min: 6 }).withMessage('Пароль должен содержать минимум 6 символов')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Пользователь успешно зарегистрирован',
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
});

// Login
app.post('/api/login', [
  body('email').isEmail().withMessage('Некорректный email'),
  body('password').notEmpty().withMessage('Пароль обязателен')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Неверный email или пароль' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Неверный email или пароль' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Успешный вход',
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
});

// Get user profile
app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate('joinedClubs');
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        joinedClubs: user.joinedClubs
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
});

// Get all clubs
app.get('/api/clubs', async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};
    
    if (category && category !== 'all') {
      query.category = category;
    }

    const clubs = await Club.find(query).populate('members', 'name').populate('createdBy', 'name');
    res.json(clubs);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
});

// Get single club
app.get('/api/clubs/:id', async (req, res) => {
  try {
    const club = await Club.findById(req.params.id)
      .populate('members', 'name email')
      .populate('createdBy', 'name');
    
    if (!club) {
      return res.status(404).json({ message: 'Клуб не найден' });
    }

    res.json(club);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
});

// Join club
app.post('/api/clubs/:id/join', authenticateToken, async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) {
      return res.status(404).json({ message: 'Клуб не найден' });
    }

    // Check if user is already a member
    if (club.members.includes(req.user.userId)) {
      return res.status(400).json({ message: 'Вы уже состоите в этом клубе' });
    }

    // Add user to club
    club.members.push(req.user.userId);
    await club.save();

    // Add club to user's joined clubs
    await User.findByIdAndUpdate(req.user.userId, {
      $addToSet: { joinedClubs: req.params.id }
    });

    res.json({ message: 'Вы успешно вступили в клуб' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
});

// Leave club
app.post('/api/clubs/:id/leave', authenticateToken, async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) {
      return res.status(404).json({ message: 'Клуб не найден' });
    }

    // Remove user from club
    club.members = club.members.filter(memberId => memberId.toString() !== req.user.userId);
    await club.save();

    // Remove club from user's joined clubs
    await User.findByIdAndUpdate(req.user.userId, {
      $pull: { joinedClubs: req.params.id }
    });

    res.json({ message: 'Вы покинули клуб' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
});

// Create club (admin function)
app.post('/api/clubs', authenticateToken, [
  body('name').notEmpty().withMessage('Название клуба обязательно'),
  body('description').notEmpty().withMessage('Описание клуба обязательно'),
  body('category').notEmpty().withMessage('Категория клуба обязательна')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, category } = req.body;

    const club = new Club({
      name,
      description,
      category,
      createdBy: req.user.userId,
      members: [req.user.userId] // Creator is automatically a member
    });

    await club.save();

    // Add club to user's joined clubs
    await User.findByIdAndUpdate(req.user.userId, {
      $addToSet: { joinedClubs: club._id }
    });

    res.status(201).json({ message: 'Клуб успешно создан', club });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
});

// Update club (only for creator)
app.put('/api/clubs/:id', authenticateToken, [
  body('name').notEmpty().withMessage('Название клуба обязательно'),
  body('description').notEmpty().withMessage('Описание клуба обязательно'),
  body('category').notEmpty().withMessage('Категория клуба обязательна')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, category } = req.body;
    const clubId = req.params.id;

    // Find club and check if user is the creator
    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({ message: 'Клуб не найден' });
    }

    if (club.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'У вас нет прав для редактирования этого клуба' });
    }

    // Update club
    club.name = name;
    club.description = description;
    club.category = category;
    
    await club.save();

    res.json({ message: 'Клуб успешно обновлен', club });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
});

// Chat API endpoints

// Get messages for a club
app.get('/api/clubs/:id/messages', authenticateToken, async (req, res) => {
  try {
    const clubId = req.params.id;
    
    // Check if club exists
    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({ message: 'Клуб не найден' });
    }

    // Check if user is a member of the club
    const isMember = club.members.some(memberId => memberId.toString() === req.user.userId);
    if (!isMember) {
      return res.status(403).json({ message: 'Вы не являетесь участником этого клуба' });
    }

    // Get messages with pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const messages = await Message.find({ club: clubId })
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const totalMessages = await Message.countDocuments({ club: clubId });

    res.json({
      messages: messages.reverse(), // Reverse to show oldest first
      pagination: {
        page,
        limit,
        total: totalMessages,
        pages: Math.ceil(totalMessages / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
});

// Send message to club
app.post('/api/clubs/:id/messages', authenticateToken, [
  body('content').notEmpty().withMessage('Сообщение не может быть пустым')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const clubId = req.params.id;
    const { content } = req.body;

    // Check if club exists
    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({ message: 'Клуб не найден' });
    }

    // Check if user is a member of the club
    const isMember = club.members.some(memberId => memberId.toString() === req.user.userId);
    if (!isMember) {
      return res.status(403).json({ message: 'Вы не являетесь участником этого клуба' });
    }

    // Create message
    const message = new Message({
      club: clubId,
      author: req.user.userId,
      content: content.trim()
    });

    await message.save();

    // Populate author info
    await message.populate('author', 'name email');

    res.status(201).json({ message: 'Сообщение отправлено', data: message });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
});

// News API endpoints

// Get news for a club
app.get('/api/clubs/:id/news', authenticateToken, async (req, res) => {
  try {
    const clubId = req.params.id;
    
    // Check if club exists
    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({ message: 'Клуб не найден' });
    }

    // Check if user is a member of the club
    const isMember = club.members.some(memberId => memberId.toString() === req.user.userId);
    if (!isMember) {
      return res.status(403).json({ message: 'Вы не являетесь участником этого клуба' });
    }

    // Get news with pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const news = await News.find({ club: clubId })
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const totalNews = await News.countDocuments({ club: clubId });

    res.json({
      news,
      pagination: {
        page,
        limit,
        total: totalNews,
        pages: Math.ceil(totalNews / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
});

// Create news for a club
app.post('/api/clubs/:id/news', authenticateToken, upload.array('images', 5), [
  body('title').notEmpty().withMessage('Заголовок новости обязателен'),
  body('content').notEmpty().withMessage('Содержание новости обязательно')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const clubId = req.params.id;
    const { title, content } = req.body;

    // Check if club exists
    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({ message: 'Клуб не найден' });
    }

    // Check if user is a member of the club
    const isMember = club.members.some(memberId => memberId.toString() === req.user.userId);
    if (!isMember) {
      return res.status(403).json({ message: 'Вы не являетесь участником этого клуба' });
    }

    // Process uploaded images
    const images = req.files ? req.files.map(file => file.filename) : [];

    // Create news
    const news = new News({
      club: clubId,
      author: req.user.userId,
      title: title.trim(),
      content: content.trim(),
      images
    });

    await news.save();

    // Populate author info
    await news.populate('author', 'name email');

    res.status(201).json({ message: 'Новость опубликована', data: news });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
});

// Update news (only for author)
app.put('/api/news/:id', authenticateToken, upload.array('images', 5), [
  body('title').notEmpty().withMessage('Заголовок новости обязателен'),
  body('content').notEmpty().withMessage('Содержание новости обязательно')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const newsId = req.params.id;
    const { title, content } = req.body;

    // Find news and check if user is the author
    const news = await News.findById(newsId);
    if (!news) {
      return res.status(404).json({ message: 'Новость не найдена' });
    }

    if (news.author.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'У вас нет прав для редактирования этой новости' });
    }

    // Process new images if any
    const newImages = req.files ? req.files.map(file => file.filename) : [];
    
    // Update news
    news.title = title.trim();
    news.content = content.trim();
    news.updatedAt = new Date();
    
    // Add new images to existing ones
    if (newImages.length > 0) {
      news.images = [...news.images, ...newImages];
    }

    await news.save();

    res.json({ message: 'Новость обновлена', data: news });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
});

// Delete news (only for author)
app.delete('/api/news/:id', authenticateToken, async (req, res) => {
  try {
    const newsId = req.params.id;

    // Find news and check if user is the author
    const news = await News.findById(newsId);
    if (!news) {
      return res.status(404).json({ message: 'Новость не найдена' });
    }

    if (news.author.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'У вас нет прав для удаления этой новости' });
    }

    await News.findByIdAndDelete(newsId);

    res.json({ message: 'Новость удалена' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
});

// Initialize sample data
const initializeData = async () => {
  try {
    // Проверяем подключение к MongoDB
    if (mongoose.connection.readyState !== 1) {
      console.log('MongoDB не подключена, пропускаем инициализацию данных');
      return;
    }

    const clubCount = await Club.countDocuments();
    if (clubCount === 0) {
      const sampleClubs = [
        {
          name: 'Киноклуб "Образ"',
          description: 'Обсуждаем лучшие фильмы, ходим в кинотеатры и делимся впечатлениями о кинематографе.',
          category: 'Культура',
          members: []
        },
        {
          name: 'Настольные игры',
          description: 'Играем в настольные игры, изучаем новые и проводим турниры.',
          category: 'Развлечения',
          members: []
        },
        {
          name: 'Футбольный клуб',
          description: 'Тренировки, товарищеские матчи и участие в университетских соревнованиях.',
          category: 'Спорт',
          members: []
        },
        {
          name: 'IT-сообщество',
          description: 'Изучаем программирование, делимся опытом и работаем над проектами.',
          category: 'IT',
          members: []
        },
        {
          name: 'Фотоклуб',
          description: 'Учимся фотографировать, организуем фотосессии и выставки.',
          category: 'Творчество',
          members: []
        },
        {
          name: 'Книжный клуб',
          description: 'Читаем и обсуждаем книги, встречаемся с авторами.',
          category: 'Культура',
          members: []
        }
      ];

      await Club.insertMany(sampleClubs);
      console.log('Образцовые клубы созданы');
    }
  } catch (error) {
    console.error('Ошибка при инициализации данных:', error.message);
  }
};

// Catch-all handler for React Router in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
  initializeData();
});
