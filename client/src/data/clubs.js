const clubs = [
  {
    _id: '1',
    name: 'IT Innovators',
    description: 'Клуб, объединяющий студентов, интересующихся новыми технологиями, хакатонами и разработкой проектов.',
    category: 'IT',
    members: [
      { _id: 'm1', name: 'Алексей Иванов', email: 'alexey@example.com' },
      { _id: 'm2', name: 'Мария Смирнова', email: 'maria@example.com' },
      { _id: 'm3', name: 'Кирилл Петров', email: 'kirill@example.com' }
    ],
    createdAt: '2023-01-15T10:00:00.000Z'
  },
  {
    _id: '2',
    name: 'Art & Culture Society',
    description: 'Творческое объединение для любителей искусства, живописи, скульптуры и выставок.',
    category: 'Культура',
    members: [
      { _id: 'm4', name: 'Елена Кузнецова', email: 'elena@example.com' },
      { _id: 'm5', name: 'Игорь Соколов', email: 'igor@example.com' }
    ],
    createdAt: '2022-10-02T12:30:00.000Z'
  },
  {
    _id: '3',
    name: 'Green Planet',
    description: 'Экологический клуб, продвигающий устойчивое развитие, переработку отходов и волонтёрские мероприятия.',
    category: 'Творчество',
    members: [
      { _id: 'm6', name: 'Наталья Орлова', email: 'natalia@example.com' },
      { _id: 'm7', name: 'Дмитрий Алексеев', email: 'dmitry@example.com' },
      { _id: 'm8', name: 'Ольга Попова', email: 'olga@example.com' },
      { _id: 'm9', name: 'Владислав Волков', email: 'vlad@example.com' }
    ],
    createdAt: '2021-05-20T08:15:00.000Z'
  },
  {
    _id: '4',
    name: 'Debate & Public Speaking',
    description: 'Клуб для тех, кто хочет совершенствовать навыки публичных выступлений и аргументации.',
    category: 'Развлечения',
    members: [
      { _id: 'm10', name: 'Светлана Фролова', email: 'svetlana@example.com' },
      { _id: 'm11', name: 'Артём Николаев', email: 'artem@example.com' }
    ],
    createdAt: '2023-03-11T09:45:00.000Z'
  },
  {
    _id: '5',
    name: 'University Football Club',
    description: 'Студенческая команда по футболу: тренировки, турнирные игры и спортивные сборы.',
    category: 'Спорт',
    members: [
      { _id: 'm12', name: 'Илья Морозов', email: 'ilya@example.com' },
      { _id: 'm13', name: 'Павел Захаров', email: 'pavel@example.com' },
      { _id: 'm14', name: 'Сергей Антонов', email: 'sergey@example.com' },
      { _id: 'm15', name: 'Анна Лебедева', email: 'anna@example.com' }
    ],
    createdAt: '2020-09-05T17:20:00.000Z'
  },
  {
    _id: '6',
    name: 'Photography Explorers',
    description: 'Клуб фотографов-энтузиастов: мастер-классы, пленэры и конкурсные проекты.',
    category: 'Творчество',
    members: [
      { _id: 'm16', name: 'Михаил Егорев', email: 'mikhail@example.com' },
      { _id: 'm17', name: 'Вера Дмитриева', email: 'vera@example.com' },
      { _id: 'm18', name: 'Егор Павлов', email: 'egor@example.com' }
    ],
    createdAt: '2022-01-22T14:10:00.000Z'
  },
  {
    _id: '7',
    name: 'Board Games League',
    description: 'Клуб настольных игр: регулярные встречи, турниры и дружеские вечеринки.',
    category: 'Развлечения',
    members: [
      { _id: 'm19', name: 'Оксана Литвинова', email: 'oksana@example.com' },
      { _id: 'm20', name: 'Андрей Чернов', email: 'andrey@example.com' },
      { _id: 'm21', name: 'Дарья Власова', email: 'daria@example.com' }
    ],
    createdAt: '2021-11-18T16:05:00.000Z'
  },
  {
    _id: '8',
    name: 'Robotics Lab',
    description: 'Команда инженеров и разработчиков, создающих роботов и участвующая в соревнованиях.',
    category: 'IT',
    members: [
      { _id: 'm22', name: 'Степан Ларионов', email: 'stepan@example.com' },
      { _id: 'm23', name: 'Инна Полякова', email: 'inna@example.com' },
      { _id: 'm24', name: 'Григорий Ковалев', email: 'grigory@example.com' }
    ],
    createdAt: '2022-07-30T11:40:00.000Z'
  }
];

export default clubs;
