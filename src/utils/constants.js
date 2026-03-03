// Application constants
export const DEPARTMENTS = [
  'General',
  'Pediatrics',
  'Dentistry',
];

export const LANGUAGES = {
  en: 'English',
  ru: 'Русский',
  kg: 'Кыргызча',
};

export const TEXT_TRANSLATIONS = {
  en: {
    // Common
    register: "Register",
    login: "Login",
    loading: "Loading...",
    error: "Error",
    success: "Success",
    help: "Help",
    home: "Home",
    
    // Clinic branding
    clinicName: "Naryn Clinic",
    
    // Home page
    title: "Naryn Clinic Queue System",
    patientRegistration: "Patient Registration",
    doctorLogin: "Doctor Login",
    
    // Login page
    doctorDashboard: "Doctor Login",
    username: "Username",
    password: "Password",
    wrongCredentials: "Wrong credentials",
    
    // Patient page
    registerPatient: "Register Patient",
    fullName: "Full Name",
    department: "Department",
    time: "Time (HH:MM)",
    day: "Day",
    yourQueueNumber: "Your Queue Number",
    position: "Position",
    status: "Status",
    
    // Doctor page
    doctorDashboardTitle: "Doctor Dashboard",
    loadPatients: "Load Patients",
    callNext: "Call Next",
    switchLanguage: "Switch Language",
    
    // Help Modal
    helpTitle: "Help & Support",
    contactInfo: "Contact Information",
    phone: "Phone",
    email: "Email",
    address: "Address",
    hours: "Working Hours",
    frequentlyAskedQuestions: "Frequently Asked Questions",
    emergencyTitle: "Emergency Contact",
    emergencyText: "For medical emergencies, please call immediately",
    callNow: "Call Now",
    
    // FAQ
    faqQueueQuestion: "How does the queue system work?",
    faqQueueAnswer: "Simply register as a patient, select your department and preferred time. You'll receive a queue number and can track your position in real-time.",
    faqRegistrationQuestion: "What information do I need to register?",
    faqRegistrationAnswer: "You'll need your full name, preferred department, appointment time, and date. The process takes less than a minute.",
    faqDoctorQuestion: "How do doctors use the system?",
    faqDoctorAnswer: "Doctors can log in with their credentials, view patient queues for any day, and call the next patient in line with a single click.",
  },
  ru: {
    // Common
    register: "Зарегистрироваться",
    login: "Войти",
    loading: "Загрузка...",
    error: "Ошибка",
    success: "Успешно",
    help: "Помощь",
    home: "Главная",
    
    // Clinic branding
    clinicName: "Нарынская клиника",
    
    // Home page
    title: "Система очереди Нарынской клиники",
    patientRegistration: "Регистрация пациента",
    doctorLogin: "Вход врача",
    
    // Login page
    doctorDashboard: "Панель врача",
    username: "Имя пользователя",
    password: "Пароль",
    wrongCredentials: "Неверные учетные данные",
    
    // Patient page
    registerPatient: "Регистрация пациента",
    fullName: "Полное имя",
    department: "Отделение",
    time: "Время (ЧЧ:ММ)",
    day: "День",
    yourQueueNumber: "Ваш номер очереди",
    position: "Позиция",
    status: "Статус",
    
    // Doctor page
    doctorDashboardTitle: "Панель врача",
    loadPatients: "Загрузить пациентов",
    callNext: "Следующий",
    switchLanguage: "Сменить язык",
    
    // Help Modal
    helpTitle: "Помощь и поддержка",
    contactInfo: "Контактная информация",
    phone: "Телефон",
    email: "Email",
    address: "Адрес",
    hours: "Часы работы",
    frequentlyAskedQuestions: "Часто задаваемые вопросы",
    emergencyTitle: "Экстренный контакт",
    emergencyText: "Для медицинских экстренных случаев, пожалуйста, звоните немедленно",
    callNow: "Позвонить сейчас",
    
    // FAQ
    faqQueueQuestion: "Как работает система очереди?",
    faqQueueAnswer: "Просто зарегистрируйтесь как пациент, выберите отделение и предпочтительное время. Вы получите номер очереди и сможете отслеживать свою позицию в реальном времени.",
    faqRegistrationQuestion: "Какая информация нужна для регистрации?",
    faqRegistrationAnswer: "Вам понадобятся полное имя, предпочтительное отделение, время приема и дата. Процесс занимает меньше минуты.",
    faqDoctorQuestion: "Как врачи используют систему?",
    faqDoctorAnswer: "Врачи могут войти со своими учетными данными, просматривать очереди пациентов на любой день и вызывать следующего пациента в очереди одним нажатием.",
  },
  kg: {
    // Common
    register: "Катталуу",
    login: "Кирүү",
    loading: "Жүктөлүүдө...",
    error: "Ката",
    success: "Ийгилик",
    help: "Жардам",
    home: "Башкы",
    
    // Clinic branding
    clinicName: "Нарын клиникасы",
    
    // Home page
    title: "Нарын клиникасынын системасы",
    patientRegistration: "Пациентти каттоо",
    doctorLogin: "Дарыгер кирүүсү",
    
    // Login page
    doctorDashboard: "Дарыгер панели",
    username: "Колдонуучу аты",
    password: "Сырсөз",
    wrongCredentials: "Туура эмес жөнөтүүлөр",
    
    // Patient page
    registerPatient: "Пациентти каттоо",
    fullName: "Толук аты",
    department: "Бөлүм",
    time: "Убакыт (ЧЧ:ММ)",
    day: "Күн",
    yourQueueNumber: "Сиздин номериңиз",
    position: "Орду",
    status: "Абалы",
    
    // Doctor page
    doctorDashboardTitle: "Дарыгер панели",
    loadPatients: "Пациенттерди жүктөө",
    callNext: "Кийинкиси",
    switchLanguage: "Тилди өзгөртүү",
    
    // Help Modal
    helpTitle: "Жардам жана колдоо",
    contactInfo: "Байланыш маалыматы",
    phone: "Телефон",
    email: "Email",
    address: "Дареги",
    hours: "Иш убактысы",
    frequentlyAskedQuestions: "Көп суралган суроолор",
    emergencyTitle: "Күтүлбөгөн байланыш",
    emergencyText: "Медициналык күтүлбөгөн учурлар үчүн, тез ара байланышыңыз",
    callNow: "Азыр чалуу",
    
    // FAQ
    faqQueueQuestion: "Кезек системасы кантип иштейт?",
    faqQueueAnswer: "Жөн эле пациент каттап, бөлүмүңүздү жана каалаган убактыңызды тандаңыз. Кезек номери алып, позицияңызды реал убакытта көзө аласыз.",
    faqRegistrationQuestion: "Каттоо үчүн кайсы маалымат керек?",
    faqRegistrationAnswer: "Сизге толук атыңыз, каалаган бөлүмүңүз, кабыл алуу убактыңыз жана күнү керек. Процесс бир минуттан аз убакытты алат.",
    faqDoctorQuestion: "Дарыгерлер системаны кантип колдонушат?",
    faqDoctorAnswer: "Дарыгерлер өз эсептөө маалыматтары менен кире алышат, кайсы күн болбосун пациенттердин кезегин көрө алышат жана кезектеги пациентти бир басуу менен чакыра алышат.",
  },
};

export const UPDATE_INTERVAL = 3000; // 3 seconds

export const STATUS_COLORS = {
  'Waiting': 'status-waiting',
  'In Progress': 'status-in-progress',
  'Completed': 'status-completed',
};
