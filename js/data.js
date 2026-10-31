/* Story, characters and tuning. */
(function () {
  'use strict';

  var CHARACTERS = {
    deniz: {
      id: 'deniz',
      name: 'Deniz',
      couple: 'A',
      partner: 'ece',
      color: '#2dd4bf',
      soft: 'rgba(45,212,191,.16)',
      tag: 'Cesur',
      icon: '⚡',
      bio: 'Kebapçıda hesabı hep o öder. Bu akşam ödeyemeyeceğini henüz bilmiyor.',
      perk: 'Soygunda hedef bölge %12 genişler.',
      quote: 'Bir kere yaşanır, deneyelim.'
    },
    ece: {
      id: 'ece',
      name: 'Ece',
      couple: 'A',
      partner: 'deniz',
      color: '#ff8fa3',
      soft: 'rgba(255,143,163,.16)',
      tag: 'Zeki',
      icon: '🧠',
      bio: 'Peçeteye üç dakikada kafe planı çizebilen tek mimar. Randevuda da plan yapıyor.',
      perk: 'Bir ekstra partner desteği kazanırsın.',
      quote: 'Panik yok. Sadece planı değiştiriyoruz.'
    },
    kerem: {
      id: 'kerem',
      name: 'Kerem',
      couple: 'B',
      partner: 'selin',
      color: '#ffcf6b',
      soft: 'rgba(255,207,107,.16)',
      tag: 'Karizmatik',
      icon: '✨',
      bio: 'Garsona adını unutturmakta üstüne yok. Kasadaki parayı da unutturabileceğini düşünüyor.',
      perk: 'İlişki başlangıcında ortaklık +12.',
      quote: 'Güven bana. Ve garsona bakma.'
    },
    selin: {
      id: 'selin',
      name: 'Selin',
      couple: 'B',
      partner: 'kerem',
      color: '#a7d8a0',
      soft: 'rgba(167,216,160,.16)',
      tag: 'Soğukkanlı',
      icon: '🧊',
      bio: 'Şalgamı sade içen tek kişi. Kriz anında nabzı düşen, plana sadık kalır.',
      perk: 'Soygunda şüphe artışı %20 azalır.',
      quote: 'Hesap mı? Hesabı konuşalım.'
    }
  };

  var PAIRS = { A: ['deniz', 'ece'], B: ['kerem', 'selin'] };

  var START = { kimya: 35, ortaklik: 25, suphe: 0 };

  var SCENES = [
    {
      time: '19:40 · Taşköprü Kahvesi',
      night: 0,
      lines: [
        { who: 'narr', text: 'Adana, 19:40. Taşköprü’nün kemerleri turuncuya kesmiş. “Taşköprü Kahvesi”nde iki çift, tek masada oturuyor.' },
        { who: 'date', text: 'Yani ikiniz de aynı uygulamadan mı geldiniz?' },
        { who: 'o1', text: 'Ben “acı sever misin?” sorusuna evet dedim. Uygulama beni buraya getirdi.' },
        { who: 'o2', text: 'Ben “şalgamı sade içer misin?” sorusuna hayır dedim. Hâlâ buradayım.' },
        { who: 'narr', text: 'Garson menüleri bırakıp gidiyor. Masada bir sessizlik, bir de fiyat listesi var.' }
      ],
      prompt: 'İlk hamle senin. Ne diyeceksin?',
      choices: [
        {
          text: '“Garson! Dört şalgam. Acıyı da eksik etme.”',
          eff: { kimya: 6, ortaklik: 8, suphe: 4 },
          reply: { who: 'o2', text: 'Bak, bu {you}’den korkulur. Ben olsam kaçardım.' }
        },
        {
          text: '“Bence bu akşam tesadüf değil.”',
          eff: { kimya: 10, ortaklik: 2 },
          reply: { who: 'date', text: 'Tesadüf değilse neyiz biz? — Gözlerini kaçırdı ama gülümsedi.' }
        },
        {
          text: '“Hesabı ben ödeyeceğim, rahat olun.”',
          eff: { kimya: 4, ortaklik: 6, suphe: 8 },
          reply: { who: 'o1', text: 'Cebindeki son kırk lirayı gördüm, {you}. Ama cesaretine saygı duydum.' }
        }
      ]
    },
    {
      time: '20:05 · Kasa Göründü',
      night: 0,
      lines: [
        { who: 'narr', text: 'Garson fiyatları tek tek sayıyor: “Kebap 380, şalgam 60, tatlı 220...”' },
        { who: 'date', text: 'Ben sadece bir kahve söyleyecektim.' },
        { who: 'o1', text: 'Ben de... iki kişilik mi alsak diye düşünüyordum.' },
        { who: 'o2', text: 'Cüzdanımda nane şekeri var. Sadece nane şekeri.' },
        { who: 'narr', text: 'Kasanın arkasında, garsonun unuttuğu bir para çantası duruyor. Işıklar tam üstüne vuruyor.' }
      ],
      prompt: 'Kimse açık konuşmuyor. Ama dört çift göz aynı yere bakıyor.',
      choices: [
        {
          text: '“Hesabı ben ödeyeceğim, rahat olun.”',
          eff: { kimya: 4, ortaklik: 2, suphe: 10 },
          reply: { who: 'o2', text: 'Yalan söylerken kulağın kızarıyor, {you}. Ama tatlıydı.' }
        },
        {
          text: '“Şu kasadaki para... hepimizin olabilir.”',
          eff: { kimya: 2, ortaklik: 12, suphe: 8 },
          reply: { who: 'o1', text: 'İşte bu. Zaten buraya bu yüzden gelmiştim.' }
        },
        {
          text: '“Önce tatlı yiyelim. Sonra kasa konuşur.”',
          eff: { kimya: 9, ortaklik: 7, suphe: 2 },
          reply: { who: 'date', text: 'Tatlıyı sen mi söylüyorsun? Tamam. Ama hesabı sen ödemiyorsun.' }
        }
      ]
    },
    {
      time: '20:30 · Peçetedeki Plan',
      night: 1,
      lines: [
        { who: 'narr', text: 'Peçete masaya seriliyor. Üstüne tuzluk, şekerlik ve bir zeytinle kafe planı çiziliyor.' },
        { who: 'date', text: 'Garson her on dakikada bir geliyor. Kasa arkada, tek görevli var.' },
        { who: 'o1', text: 'Ben garsonu oyalarım. Siz kasayı halledin.' },
        { who: 'o2', text: 'Peki ya yakalanırsak? Ne diyeceğiz?' }
      ],
      prompt: 'Şifreli cümleyi seç. Kafede herkes duyacak.',
      choices: [
        {
          text: '“Şifre ‘aşkım’ olsun. Kimse şüphelenmez.”',
          eff: { kimya: 10, ortaklik: 4, suphe: -2 },
          reply: { who: 'date', text: '“Aşkım” deyince gözlerimin içine bak. Rol yapmıyormuş gibi.' }
        },
        {
          text: '“Şifre ‘acı’ olsun. Bu şehirde kimse acıya şaşırmaz.”',
          eff: { kimya: 5, ortaklik: 10, suphe: -4 },
          reply: { who: 'o2', text: 'Adanalılar acıya ağlamaz. Ama bu plana ağlayabilirler.' }
        },
        {
          text: '“Şifre ‘kebap’. Herkes acıkır, kimse dinlemez.”',
          eff: { kimya: 6, ortaklik: 8, suphe: 6 },
          reply: { who: 'o1', text: 'Garson “kebap” duyunca mutfağa koşar. Bu bir bilimsel gerçek.' }
        }
      ]
    }
  ];

  var PLANS = [
    {
      id: 'tatli',
      icon: '🍮',
      title: 'Tatlı Krizi',
      desc: 'Tatlılar havada uçuşur, garson mutfağa koşar. Ekip geniş bir zaman penceresi yakalar.',
      pros: ['Hedef bölge +22%', 'Rahat zamanlama'],
      cons: ['Gürültü şüpheyi artırır'],
      zone: 1.22,
      susp: 1.08,
      loot: 1,
      brief: 'Tatlılar fırlatılır, garson mutfağa koşar. İbre daha rahat yakalanır ama gürültü şüpheyi biraz artırır.'
    },
    {
      id: 'salgam',
      icon: '🥤',
      title: 'Şalgam Servisi',
      desc: 'Garsona taze şalgam tutuşturulur. Mutfakta kaybolur, şüphe yavaşlar.',
      pros: ['Şüphe artışı -30%', 'Güvenli çıkış'],
      cons: ['Zaman penceresi dar'],
      zone: 1.05,
      susp: 0.7,
      loot: 1,
      brief: 'Garson şalgamla mutfakta kaybolur. Şüphe yavaşlar ama zaman penceresi çok geniş değil.'
    },
    {
      id: 'kasa',
      icon: '💰',
      title: 'Kasa Hücumu',
      desc: 'Plan yok, cesaret var. Doğrudan kasaya yürünür; para daha çok, hata affetmez.',
      pros: ['Ganimet +35%', 'Yüksek risk'],
      cons: ['Hedef bölge -15%', 'Şüphe daha hızlı'],
      zone: 0.85,
      susp: 1.15,
      loot: 1.35,
      brief: 'Doğrudan kasaya. Ganimet büyük, hedef bölge dar ve şüphe hızlı. Cesaretin varsa buyur.'
    }
  ];

  var HEIST_ROUNDS = [
    {
      title: 'Garsonu oyala',
      hint: 'İbre yeşil bölgedeyken dokun.',
      loot: 12000, zone: 0.30, speed: 145, time: 6.5,
      win: 'Garson mutfağa gitti. Kasa göründü.',
      lose: 'Garson döndü ve masaya baktı.'
    },
    {
      title: 'Görevliyi geç',
      hint: 'Tezgâhın arkasına süzül. Tek dokunuş.',
      loot: 16000, zone: 0.24, speed: 185, time: 5.8,
      win: 'Görevli telefonuna daldı. Yol açık.',
      lose: 'Görevli başını kaldırdı: “Bir şey mi dediniz?”'
    },
    {
      title: 'Kasayı aç',
      hint: 'Şifre peçetede. İbreyi kaçırma.',
      loot: 22000, zone: 0.20, speed: 225, time: 5.2,
      win: 'Kasa açıldı. Para desteleri ışıl ışıl.',
      lose: 'Kasa öttü. Bütün kafe bir an sustu.'
    },
    {
      title: 'Parayı çantala',
      hint: 'Sakin ol. Desteleri sayma, doldur.',
      loot: 26000, zone: 0.16, speed: 270, time: 4.6,
      win: 'Çanta doldu. Fermuar zor kapanıyor.',
      lose: 'Bir deste yere düştü. Herkes sesi duydu.'
    },
    {
      title: 'Seyhan’a yürü',
      hint: 'Koşma. Adana’da koşan dikkat çeker.',
      loot: 30000, zone: 0.13, speed: 315, time: 4.2,
      win: 'Taşköprü’nün altında kayboldunuz. Şehir sizi yuttu.',
      lose: 'Arkanızdan bir garson sesi: “Hesap efendim!”'
    }
  ];

  var ENDINGS = [
    {
      id: 'ghost',
      title: 'Hayalet Masa',
      icon: '👻',
      stamp: 'HİÇ GÖRÜLMEDİ',
      color: '#b9a6ff',
      rank: 'S',
      text: 'Ne gürültü, ne şüphe. Kasa boşaldı, garson hâlâ mutfakta şarkı söylüyor. Adana polisi olayı “iyi organize olmuş bir aşk hikâyesi” olarak kayda geçirdi.',
      quote: '“Ben bir şey görmedim.”'
    },
    {
      id: 'legend',
      title: 'Efsane Çift',
      icon: '✦',
      stamp: 'TEMİZ ÇIKIŞ',
      color: '#ffcf6b',
      rank: 'S',
      text: 'Dört kişi, tek kasa, sıfır şüphe. Ertesi hafta aynı masada iki çift olarak oturuyorsunuz. Garson sizi tanıyor ama bir şey demiyor; bahşişi sizden.',
      quote: '“Bir daha ki randevu benden.”'
    },
    {
      id: 'love',
      title: 'Aşk Galip',
      icon: '♥',
      stamp: 'KALP DOLU',
      color: '#ff8fa3',
      rank: 'A',
      text: 'Parayı böldünüz ama {date} elini bırakmadı. Diğer çift taksiye binerken siz Taşköprü’de yürüdünüz. Kasa boş, kalp dolu.',
      quote: '“Parayı unut, şalgamı unutma.”'
    },
    {
      id: 'crew',
      title: 'Dört Kafadar',
      icon: '🤝',
      stamp: 'EKİP ÇIKTI',
      color: '#2dd4bf',
      rank: 'A',
      text: 'Soygun bitti, randevu değil. {date} “biz arkadaş kaldık” dedi. Diğer çiftle kebapçıya gittiniz. Adana’da aşk bazen kanka olarak devam eder.',
      quote: '“Kanka mı? Kanka.”'
    },
    {
      id: 'cold',
      title: 'Soğuk Hesaplaşma',
      icon: '🧾',
      stamp: 'ZOR BELA',
      color: '#9fb3c8',
      rank: 'B',
      text: 'Parayı böldünüz. Kimse kimseye bakmadı. Ertesi gün uygulamada dört ayrı eşleşme çıktı.',
      quote: '“Hesabı sen öde.”'
    },
    {
      id: 'caught',
      title: 'Kafede Yakalandı',
      icon: '🚨',
      stamp: 'YAKALANDIN',
      color: '#ff5f4a',
      rank: 'F',
      text: 'Garson elinde şalgamla kapıda: “Hesap 1.240 lira.” Dört kişi cebini aynı anda kontrol etti. Polis geldiğinde hâlâ tatlı menüsünü tartışıyordunuz.',
      quote: '“Tatlıyı paket yapabilir misiniz?”'
    }
  ];

  var STORE_KEY = 'adana_ask_soygun_v1';

  window.GameData = {
    CHARACTERS: CHARACTERS,
    PAIRS: PAIRS,
    START: START,
    SCENES: SCENES,
    PLANS: PLANS,
    HEIST_ROUNDS: HEIST_ROUNDS,
    ENDINGS: ENDINGS,
    STORE_KEY: STORE_KEY
  };
})();
