const initialClubs = [
  {
    _id: 'club-robotics',
    name: 'Клуб робототехники',
    category: 'IT',
    description: 'Разрабатываем интеллектуальные устройства, проводим хакатоны и участвуем в робототехнических соревнованиях.',
    createdAt: '2023-09-15T10:00:00.000Z',
    createdBy: {
      _id: 'user-anna-smirnova',
      name: 'Анна Смирнова',
      email: 'anna@university.ru',
    },
    members: [
      { _id: 'user-anna-smirnova', name: 'Анна Смирнова', email: 'anna@university.ru' },
      { _id: 'user-ivan-ivanov', name: 'Иван Иванов', email: 'ivan@university.ru' },
      { _id: 'user-olga-petrova', name: 'Ольга Петрова', email: 'olga@university.ru' },
    ],
    activities: [
      {
        id: 'robotics-1',
        title: 'Мастер-классы по Arduino',
        description: 'Еженедельные занятия по программированию микроконтроллеров и работе с датчиками.'
      },
      {
        id: 'robotics-2',
        title: 'Подготовка к соревнованиям',
        description: 'Собираем команды для участия в RoboCup и локальных хакатонах.'
      }
    ],
    upcomingEvents: [
      {
        id: 'robotics-event-1',
        title: 'Университетский RoboDay',
        date: '2024-10-05',
        location: 'Лаборатория робототехники, корпус Б'
      }
    ],
    resources: [
      { id: 'robotics-resource-1', label: 'Telegram чат', url: 'https://t.me/university-robotics' },
      { id: 'robotics-resource-2', label: 'GitHub организации', url: 'https://github.com/university-robotics' }
    ]
  },
  {
    _id: 'club-photography',
    name: 'Фото-клуб «Свет и кадр»',
    category: 'Творчество',
    description: 'Учимся фотографировать, обсуждаем портфолио и организуем пленэры по всему городу.',
    createdAt: '2022-02-20T14:30:00.000Z',
    createdBy: {
      _id: 'user-sergey-belyaev',
      name: 'Сергей Беляев',
      email: 'sergey@university.ru',
    },
    members: [
      { _id: 'user-sergey-belyaev', name: 'Сергей Беляев', email: 'sergey@university.ru' },
      { _id: 'user-maria-vasileva', name: 'Мария Васильева', email: 'maria@university.ru' },
      { _id: 'user-oleg-smirnov', name: 'Олег Смирнов', email: 'oleg@university.ru' },
      { _id: 'user-ksenia-mironova', name: 'Ксения Миронова', email: 'ksenia@university.ru' },
    ],
    activities: [
      {
        id: 'photography-1',
        title: 'Разбор портфолио',
        description: 'Ежемесячные встречи, на которых участники получают обратную связь и советы от профессионалов.'
      },
      {
        id: 'photography-2',
        title: 'Пленэры по выходным',
        description: 'Организуем городские прогулки и совместные фотосессии на природе.'
      }
    ],
    upcomingEvents: [
      {
        id: 'photography-event-1',
        title: 'Фотовыставка «Город и люди»',
        date: '2024-09-12',
        location: 'Арт-пространство «Лестница», корпус Д'
      },
      {
        id: 'photography-event-2',
        title: 'Мастер-класс по студийному свету',
        date: '2024-10-01',
        location: 'Студия №2, медиа-центр университета'
      }
    ],
    resources: [
      { id: 'photography-resource-1', label: 'Instagram клуба', url: 'https://instagram.com/lightandframe' },
      { id: 'photography-resource-2', label: 'Доска с заданиями', url: 'https://miro.com/lightandframe' }
    ]
  },
  {
    _id: 'club-running',
    name: 'Беговой клуб «Пульс»',
    category: 'Спорт',
    description: 'Совместные пробежки по утрам, подготовка к забегам и поддержка здорового образа жизни.',
    createdAt: '2021-05-10T07:00:00.000Z',
    createdBy: {
      _id: 'user-dmitry-sokolov',
      name: 'Дмитрий Соколов',
      email: 'dmitry@university.ru',
    },
    members: [
      { _id: 'user-dmitry-sokolov', name: 'Дмитрий Соколов', email: 'dmitry@university.ru' },
      { _id: 'user-natalia-ermakova', name: 'Наталия Ермакова', email: 'natalia@university.ru' },
      { _id: 'user-alexey-kuznetsov', name: 'Алексей Кузнецов', email: 'alexey@university.ru' }
    ],
    activities: [
      {
        id: 'running-1',
        title: 'Утренние пробежки',
        description: 'Встречаемся три раза в неделю в 7:30 на стадионе и пробегаем 5-7 км в группе.'
      },
      {
        id: 'running-2',
        title: 'Лекции о питании',
        description: 'Приглашаем нутрициологов и спортивных врачей для лекций о восстановлении и тренировках.'
      }
    ],
    upcomingEvents: [
      {
        id: 'running-event-1',
        title: 'Подготовка к полумарафону',
        date: '2024-08-18',
        location: 'Городской стадион'
      }
    ],
    resources: [
      { id: 'running-resource-1', label: 'Strava сообщество', url: 'https://www.strava.com/clubs/university-pulse' },
      { id: 'running-resource-2', label: 'Telegram-канал', url: 'https://t.me/university-pulse' }
    ]
  }
];

export default initialClubs;
