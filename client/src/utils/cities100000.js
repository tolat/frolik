const cities = [
  {
    name: "Opole",
    country: "PL",
    timezone: "Europe/Warsaw",
  },
  {
    name: "Koszalin",
    country: "PL",
    timezone: "Europe/Warsaw",
  },
  {
    name: "Gdańsk",
    country: "PL",
    timezone: "Europe/Warsaw",
  },
  {
    name: "Carolina",
    country: "PR",
    timezone: "America/Puerto_Rico",
  },
  {
    name: "Coimbra",
    country: "PT",
    timezone: "Europe/Lisbon",
  },
  {
    name: "Cluj-Napoca",
    country: "RO",
    timezone: "Europe/Bucharest",
  },
  {
    name: "Baia Mare",
    country: "RO",
    timezone: "Europe/Bucharest",
  },
  {
    name: "Astoria",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "East New York",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Cleveland",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Gilbert",
    country: "US",
    timezone: "America/Phoenix",
  },
  {
    name: "Tri-Cities",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Bukhara",
    country: "UZ",
    timezone: "Asia/Samarkand",
  },
  {
    name: "Charallave",
    country: "VE",
    timezone: "America/Caracas",
  },
  {
    name: "Tây Ninh",
    country: "VN",
    timezone: "Asia/Ho_Chi_Minh",
  },
  {
    name: "Tam Kỳ",
    country: "VN",
    timezone: "Asia/Ho_Chi_Minh",
  },
  {
    name: "Dĩ An",
    country: "VN",
    timezone: "Asia/Ho_Chi_Minh",
  },
  {
    name: "Cờ Đỏ",
    country: "VN",
    timezone: "Asia/Ho_Chi_Minh",
  },
  {
    name: "Cẩm Phả Mines",
    country: "VN",
    timezone: "Asia/Bangkok",
  },
  {
    name: "Diepsloot",
    country: "ZA",
    timezone: "Africa/Johannesburg",
  },
  {
    name: "Tláhuac",
    country: "MX",
    timezone: "America/Mexico_City",
  },
  {
    name: "Santa María Chimalhuacán",
    country: "MX",
    timezone: "America/Mexico_City",
  },
  {
    name: "San Cristóbal de las Casas",
    country: "MX",
    timezone: "America/Mexico_City",
  },
  {
    name: "Poza Rica de Hidalgo",
    country: "MX",
    timezone: "America/Mexico_City",
  },
  {
    name: "Magdalena Contreras",
    country: "MX",
    timezone: "America/Mexico_City",
  },
  {
    name: "Iguala de la Independencia",
    country: "MX",
    timezone: "America/Mexico_City",
  },
  {
    name: "Santa Catarina",
    country: "MX",
    timezone: "America/Monterrey",
  },
  {
    name: "La Paz",
    country: "MX",
    timezone: "America/Mazatlan",
  },
  {
    name: "Ciudad Apodaca",
    country: "MX",
    timezone: "America/Monterrey",
  },
  {
    name: "Johor Bahru",
    country: "MY",
    timezone: "Asia/Kuala_Lumpur",
  },
  {
    name: "Butterworth",
    country: "MY",
    timezone: "Asia/Kuala_Lumpur",
  },
  {
    name: "Kampung Sungai Ara",
    country: "MY",
    timezone: "Asia/Kuala_Lumpur",
  },
  {
    name: "Tete",
    country: "MZ",
    timezone: "Africa/Maputo",
  },
  {
    name: "Owerri",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Iwo",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Ijebu-Igbo",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Sloviansk",
    country: "UA",
    timezone: "Europe/Kyiv",
  },
  {
    name: "Kherson",
    country: "UA",
    timezone: "Europe/Kyiv",
  },
  {
    name: "Chernihiv",
    country: "UA",
    timezone: "Europe/Kyiv",
  },
  {
    name: "Hollywood",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Jacksonville",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Durham",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Wigan",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Ürümqi",
    country: "CN",
    timezone: "Asia/Urumqi",
  },
  {
    name: "Hami",
    country: "CN",
    timezone: "Asia/Urumqi",
  },
  {
    name: "Zhicheng",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Zhaoyuan",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Zhuhai",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Qingdao",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Nanping",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Nada",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Linxia Chengguanzhen",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Lengshuijiang",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Qianzhou",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Hejiang",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Guyuan",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Enshi",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Changyi",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Baisha",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Xilin Hot",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Hulan",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Zoetermeer",
    country: "NL",
    timezone: "Europe/Amsterdam",
  },
  {
    name: "Kurnool",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Kānchrāpāra",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Gwalior",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Gorakhpur",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Dombivli",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Cuddalore",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Chandannagar",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Bijapur",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Bhiwāni",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Begusarai",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Barnāla",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Ādilābād",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Malkajgiri",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Kallakurichi",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Sīnah",
    country: "IQ",
    timezone: "Asia/Baghdad",
  },
  {
    name: "Dihok",
    country: "IQ",
    timezone: "Asia/Baghdad",
  },
  {
    name: "Semnan",
    country: "IR",
    timezone: "Asia/Tehran",
  },
  {
    name: "Ardabīl",
    country: "IR",
    timezone: "Asia/Tehran",
  },
  {
    name: "Pasragad Branch",
    country: "IR",
    timezone: "Asia/Tehran",
  },
  {
    name: "Terni",
    country: "IT",
    timezone: "Europe/Rome",
  },
  {
    name: "Villa Nueva",
    country: "GT",
    timezone: "America/Guatemala",
  },
  {
    name: "Tegucigalpa",
    country: "HN",
    timezone: "America/Tegucigalpa",
  },
  {
    name: "Kecskemét",
    country: "HU",
    timezone: "Europe/Budapest",
  },
  {
    name: "Kisaran",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Sungailiat",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Sumedang",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Pamulang",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Martapura",
    country: "ID",
    timezone: "Asia/Makassar",
  },
  {
    name: "Bekasi",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Baturaja",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Pār Naogaon",
    country: "BD",
    timezone: "Asia/Dhaka",
  },
  {
    name: "Huambo",
    country: "AO",
    timezone: "Africa/Luanda",
  },
  {
    name: "Morón",
    country: "AR",
    timezone: "America/Argentina/Buenos_Aires",
  },
  {
    name: "La Plata",
    country: "AR",
    timezone: "America/Argentina/Buenos_Aires",
  },
  {
    name: "Buenos Aires",
    country: "AR",
    timezone: "America/Argentina/Buenos_Aires",
  },
  {
    name: "Newcastle",
    country: "AU",
    timezone: "Australia/Sydney",
  },
  {
    name: "Regensburg",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Nürnberg",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Köln",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Altona",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Gelsenkirchen",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Erlangen",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Duisburg",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Tamale",
    country: "GH",
    timezone: "Africa/Accra",
  },
  {
    name: "Atsiaman",
    country: "GH",
    timezone: "Africa/Accra",
  },
  {
    name: "Cork",
    country: "IE",
    timezone: "Europe/Dublin",
  },
  {
    name: "Saharsa",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Nanded",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Pātan",
    country: "NP",
    timezone: "Asia/Kathmandu",
  },
  {
    name: "Ormoc",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Khuzdar",
    country: "PK",
    timezone: "Asia/Karachi",
  },
  {
    name: "Shchyolkovo",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Elektrostal’",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Biysk",
    country: "RU",
    timezone: "Asia/Barnaul",
  },
  {
    name: "Kalininskiy",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Sulţānah",
    country: "SA",
    timezone: "Asia/Riyadh",
  },
  {
    name: "Ad-Damazin",
    country: "SD",
    timezone: "Africa/Khartoum",
  },
  {
    name: "Santa Tecla",
    country: "SV",
    timezone: "America/El_Salvador",
  },
  {
    name: "Konibodom",
    country: "TJ",
    timezone: "Asia/Dushanbe",
  },
  {
    name: "Türkmenabat",
    country: "TM",
    timezone: "Asia/Ashgabat",
  },
  {
    name: "Mersin",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Esenyurt",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Mwanza",
    country: "TZ",
    timezone: "Africa/Dar_es_Salaam",
  },
  {
    name: "Xiangjiaba",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Jiashan",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "San Miguel del Padrón",
    country: "CU",
    timezone: "America/Havana",
  },
  {
    name: "Praia",
    country: "CV",
    timezone: "Atlantic/Cape_Verde",
  },
  {
    name: "Willemstad",
    country: "CW",
    timezone: "America/Curacao",
  },
  {
    name: "Ostrava",
    country: "CZ",
    timezone: "Europe/Prague",
  },
  {
    name: "Liberec",
    country: "CZ",
    timezone: "Europe/Prague",
  },
  {
    name: "Sofia",
    country: "BG",
    timezone: "Europe/Sofia",
  },
  {
    name: "Sacaba",
    country: "BO",
    timezone: "America/La_Paz",
  },
  {
    name: "Caruaru",
    country: "BR",
    timezone: "America/Recife",
  },
  {
    name: "São Vicente",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Petrópolis",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Passo Fundo",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Nova Iguaçu",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Mauá",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Diadema",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Camaçari",
    country: "BR",
    timezone: "America/Bahia",
  },
  {
    name: "Kitchener",
    country: "CA",
    timezone: "America/Toronto",
  },
  {
    name: "Anyama",
    country: "CI",
    timezone: "Africa/Abidjan",
  },
  {
    name: "Bochum",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Berlin",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Hamburg-Nord",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Batna",
    country: "DZ",
    timezone: "Africa/Algiers",
  },
  {
    name: "Aïn Beïda",
    country: "DZ",
    timezone: "Africa/Algiers",
  },
  {
    name: "Machala",
    country: "EC",
    timezone: "America/Guayaquil",
  },
  {
    name: "Guayaquil",
    country: "EC",
    timezone: "America/Guayaquil",
  },
  {
    name: "Madīnat Sittah Uktūbar",
    country: "EG",
    timezone: "Africa/Cairo",
  },
  {
    name: "Ismailia",
    country: "EG",
    timezone: "Africa/Cairo",
  },
  {
    name: "Hurghada",
    country: "EG",
    timezone: "Africa/Cairo",
  },
  {
    name: "Albacete",
    country: "ES",
    timezone: "Europe/Madrid",
  },
  {
    name: "Tetuán de las Victorias",
    country: "ES",
    timezone: "Europe/Madrid",
  },
  {
    name: "Zarqa",
    country: "JO",
    timezone: "Asia/Amman",
  },
  {
    name: "Yokkaichi",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Tokuyama",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Moriguchi",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Mishima",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Kisarazu",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Kashiwa",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Narita",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Jōetsu",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Ruiru",
    country: "KE",
    timezone: "Africa/Nairobi",
  },
  {
    name: "Nakuru",
    country: "KE",
    timezone: "Africa/Nairobi",
  },
  {
    name: "Wŏnju",
    country: "KR",
    timezone: "Asia/Seoul",
  },
  {
    name: "Taraz",
    country: "KZ",
    timezone: "Asia/Almaty",
  },
  {
    name: "Astana",
    country: "KZ",
    timezone: "Asia/Almaty",
  },
  {
    name: "Riga",
    country: "LV",
    timezone: "Europe/Riga",
  },
  {
    name: "Şabrātah",
    country: "LY",
    timezone: "Africa/Tripoli",
  },
  {
    name: "Rabat",
    country: "MA",
    timezone: "Africa/Casablanca",
  },
  {
    name: "Bălţi",
    country: "MD",
    timezone: "Europe/Chisinau",
  },
  {
    name: "Blantyre",
    country: "MW",
    timezone: "Africa/Blantyre",
  },
  {
    name: "Bacău",
    country: "RO",
    timezone: "Europe/Bucharest",
  },
  {
    name: "Yaroslavl",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Bergamo",
    country: "IT",
    timezone: "Europe/Rome",
  },
  {
    name: "Arezzo",
    country: "IT",
    timezone: "Europe/Rome",
  },
  {
    name: "Russeifa",
    country: "JO",
    timezone: "Asia/Amman",
  },
  {
    name: "Tsu",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Osaka",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Niihama",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Matsudo",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Kanazawa",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Itami",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Honchō",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Chōfu",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Kōriyama",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Chiba",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Sapporo",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Ebina",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Eldoret",
    country: "KE",
    timezone: "Africa/Nairobi",
  },
  {
    name: "Jalal-Abad",
    country: "KG",
    timezone: "Asia/Bishkek",
  },
  {
    name: "Pohang",
    country: "KR",
    timezone: "Asia/Seoul",
  },
  {
    name: "Mokpo",
    country: "KR",
    timezone: "Asia/Seoul",
  },
  {
    name: "Gumi",
    country: "KR",
    timezone: "Asia/Seoul",
  },
  {
    name: "Kimhae",
    country: "KR",
    timezone: "Asia/Seoul",
  },
  {
    name: "Cheonan",
    country: "KR",
    timezone: "Asia/Seoul",
  },
  {
    name: "Tarhuna",
    country: "LY",
    timezone: "Africa/Tripoli",
  },
  {
    name: "Madhyapur Thimi",
    country: "NP",
    timezone: "Asia/Kathmandu",
  },
  {
    name: "Manukau City",
    country: "NZ",
    timezone: "Pacific/Auckland",
  },
  {
    name: "Talisay",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "General Santos",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Cotabato",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Bacolod City",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Mirpur Khas",
    country: "PK",
    timezone: "Asia/Karachi",
  },
  {
    name: "Heroica Matamoros",
    country: "MX",
    timezone: "America/Matamoros",
  },
  {
    name: "San Luis Potosí",
    country: "MX",
    timezone: "America/Mexico_City",
  },
  {
    name: "Culiacán",
    country: "MX",
    timezone: "America/Mazatlan",
  },
  {
    name: "Kluang",
    country: "MY",
    timezone: "Asia/Kuala_Lumpur",
  },
  {
    name: "Uromi",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Okene",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Nsukka",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Kaduna",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Hadejia",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Ebute Ikorodu",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Benin City",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Bama",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Fargo",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "Syracuse",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Phoenix",
    country: "US",
    timezone: "America/Phoenix",
  },
  {
    name: "Carlsbad",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Escondido",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Paradise",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Spring Valley",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Urganch",
    country: "UZ",
    timezone: "Asia/Samarkand",
  },
  {
    name: "Navoiy",
    country: "UZ",
    timezone: "Asia/Samarkand",
  },
  {
    name: "Tinaquillo",
    country: "VE",
    timezone: "America/Caracas",
  },
  {
    name: "Guarenas",
    country: "VE",
    timezone: "America/Caracas",
  },
  {
    name: "Lizhi",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Huixing",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Shuanglonghu",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Salzgitter",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Cherkasy",
    country: "UA",
    timezone: "Europe/Kyiv",
  },
  {
    name: "Pristina",
    country: "XK",
    timezone: "Europe/Belgrade",
  },
  {
    name: "Kitwe",
    country: "ZM",
    timezone: "Africa/Lusaka",
  },
  {
    name: "Chitungwiza",
    country: "ZW",
    timezone: "Africa/Harare",
  },
  {
    name: "Kigoma",
    country: "TZ",
    timezone: "Africa/Dar_es_Salaam",
  },
  {
    name: "Tyoply Stan",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Tambov",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "El Oued",
    country: "DZ",
    timezone: "Africa/Algiers",
  },
  {
    name: "Eloy Alfaro",
    country: "EC",
    timezone: "America/Guayaquil",
  },
  {
    name: "Qinā",
    country: "EG",
    timezone: "Africa/Cairo",
  },
  {
    name: "Dikirnis",
    country: "EG",
    timezone: "Africa/Cairo",
  },
  {
    name: "Banī Mazār",
    country: "EG",
    timezone: "Africa/Cairo",
  },
  {
    name: "Abnūb",
    country: "EG",
    timezone: "Africa/Cairo",
  },
  {
    name: "Sant Andreu",
    country: "ES",
    timezone: "Europe/Madrid",
  },
  {
    name: "Logroño",
    country: "ES",
    timezone: "Europe/Madrid",
  },
  {
    name: "Badalona",
    country: "ES",
    timezone: "Europe/Madrid",
  },
  {
    name: "Carabanchel",
    country: "ES",
    timezone: "Europe/Madrid",
  },
  {
    name: "Shashemenē",
    country: "ET",
    timezone: "Africa/Addis_Ababa",
  },
  {
    name: "Toulouse",
    country: "FR",
    timezone: "Europe/Paris",
  },
  {
    name: "Cergy-Pontoise",
    country: "FR",
    timezone: "Europe/Paris",
  },
  {
    name: "Bohicon",
    country: "BJ",
    timezone: "Africa/Porto-Novo",
  },
  {
    name: "Volta Redonda",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Teresópolis",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Taboão da Serra",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Sete Lagoas",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Presidente Prudente",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Guarapari",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Goiânia",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Cascavel",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Nassau",
    country: "BS",
    timezone: "America/Nassau",
  },
  {
    name: "Laval",
    country: "CA",
    timezone: "America/Toronto",
  },
  {
    name: "Mbuji-Mayi",
    country: "CD",
    timezone: "Africa/Lubumbashi",
  },
  {
    name: "Santiago",
    country: "CL",
    timezone: "America/Santiago",
  },
  {
    name: "La Serena",
    country: "CL",
    timezone: "America/Santiago",
  },
  {
    name: "La Pintana",
    country: "CL",
    timezone: "America/Santiago",
  },
  {
    name: "Nkongsamba",
    country: "CM",
    timezone: "Africa/Douala",
  },
  {
    name: "Kousséri",
    country: "CM",
    timezone: "Africa/Douala",
  },
  {
    name: "Zunyi",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Zhoukou",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Zhanjiang",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Zhongxiang",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Xunchang",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Xiantao",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Wugang",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Wenzhou",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Tongling",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Shanwei",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Peicheng",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Nancun",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Luohe",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Lianjiang",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Kunming",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Jizhou",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Jieshi",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Cixi",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Hanzhong",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Guangzhou",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Donghai",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Yichun",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Tuzla",
    country: "BA",
    timezone: "Europe/Sarajevo",
  },
  {
    name: "Barishal",
    country: "BD",
    timezone: "Asia/Dhaka",
  },
  {
    name: "Saidpur",
    country: "BD",
    timezone: "Asia/Dhaka",
  },
  {
    name: "Recklinghausen",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Oberhausen",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Munich",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Karlsruhe",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "San Luis",
    country: "AR",
    timezone: "America/Argentina/San_Luis",
  },
  {
    name: "Pervouralsk",
    country: "RU",
    timezone: "Asia/Yekaterinburg",
  },
  {
    name: "Orenburg",
    country: "RU",
    timezone: "Asia/Yekaterinburg",
  },
  {
    name: "Kazan",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Gol’yanovo",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Tyumen",
    country: "RU",
    timezone: "Asia/Yekaterinburg",
  },
  {
    name: "Surgut",
    country: "RU",
    timezone: "Asia/Yekaterinburg",
  },
  {
    name: "Kigali",
    country: "RW",
    timezone: "Africa/Kigali",
  },
  {
    name: "Pak Kret",
    country: "TH",
    timezone: "Asia/Bangkok",
  },
  {
    name: "Mueang Nonthaburi",
    country: "TH",
    timezone: "Asia/Bangkok",
  },
  {
    name: "Pattaya",
    country: "TH",
    timezone: "Asia/Bangkok",
  },
  {
    name: "İskenderun",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Diyarbakır",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Derince",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Bolu",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Jerusalem",
    country: "IL",
    timezone: "Asia/Jerusalem",
  },
  {
    name: "Yamunānagar",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Rajpur Sonarpur",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Sirsa",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Rājahmundry",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Ponnāni",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Patna",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Palakkad",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Kanpur",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Jalpāiguri",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Indore",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Hugli",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Hālīsahar",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Guntakal Junction",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Borūjerd",
    country: "IR",
    timezone: "Asia/Tehran",
  },
  {
    name: "Lárisa",
    country: "GR",
    timezone: "Europe/Athens",
  },
  {
    name: "Hong Kong",
    country: "HK",
    timezone: "Asia/Hong_Kong",
  },
  {
    name: "Fanling",
    country: "HK",
    timezone: "Asia/Hong_Kong",
  },
  {
    name: "Tigwav",
    country: "HT",
    timezone: "America/Port-au-Prince",
  },
  {
    name: "Pétionville",
    country: "HT",
    timezone: "America/Port-au-Prince",
  },
  {
    name: "Padangsidempuan",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Pekanbaru",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Malang",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Ciamis",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Banjaran",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Padalarang",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Oldham",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Newcastle under Lyme",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Serekunda",
    country: "GM",
    timezone: "Africa/Banjul",
  },
  {
    name: "Maykop",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Engels",
    country: "RU",
    timezone: "Europe/Saratov",
  },
  {
    name: "Balakovo",
    country: "RU",
    timezone: "Europe/Saratov",
  },
  {
    name: "Kemerovo",
    country: "RU",
    timezone: "Asia/Novokuznetsk",
  },
  {
    name: "Yakutsk",
    country: "RU",
    timezone: "Asia/Yakutsk",
  },
  {
    name: "Ust’-Ilimsk",
    country: "RU",
    timezone: "Asia/Irkutsk",
  },
  {
    name: "El Obeid",
    country: "SD",
    timezone: "Africa/Khartoum",
  },
  {
    name: "Malmö",
    country: "SE",
    timezone: "Europe/Stockholm",
  },
  {
    name: "Kenema",
    country: "SL",
    timezone: "Africa/Freetown",
  },
  {
    name: "Moundou",
    country: "TD",
    timezone: "Africa/Ndjamena",
  },
  {
    name: "Udon Thani",
    country: "TH",
    timezone: "Asia/Bangkok",
  },
  {
    name: "Trabzon",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Maltepe",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Xizhi",
    country: "TW",
    timezone: "Asia/Taipei",
  },
  {
    name: "Zaporizhzhya",
    country: "UA",
    timezone: "Europe/Kyiv",
  },
  {
    name: "Bayamón",
    country: "PR",
    timezone: "America/Puerto_Rico",
  },
  {
    name: "Lambaré",
    country: "PY",
    timezone: "America/Asuncion",
  },
  {
    name: "Saint-Paul",
    country: "RE",
    timezone: "Indian/Reunion",
  },
  {
    name: "Zlatoust",
    country: "RU",
    timezone: "Asia/Yekaterinburg",
  },
  {
    name: "Brovary",
    country: "UA",
    timezone: "Europe/Kyiv",
  },
  {
    name: "Miami Gardens",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "St. Petersburg",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Norman",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "Hafizabad",
    country: "PK",
    timezone: "Asia/Karachi",
  },
  {
    name: "Bahawalpur",
    country: "PK",
    timezone: "Asia/Karachi",
  },
  {
    name: "Targówek",
    country: "PL",
    timezone: "Europe/Warsaw",
  },
  {
    name: "Śródmieście",
    country: "PL",
    timezone: "Europe/Warsaw",
  },
  {
    name: "Lutsk",
    country: "UA",
    timezone: "Europe/Kyiv",
  },
  {
    name: "Tula",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Tongchuan",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Huanggang",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Villavicencio",
    country: "CO",
    timezone: "America/Bogota",
  },
  {
    name: "Facatativá",
    country: "CO",
    timezone: "America/Bogota",
  },
  {
    name: "Guantánamo",
    country: "CU",
    timezone: "America/Havana",
  },
  {
    name: "Bremerhaven",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Århus",
    country: "DK",
    timezone: "Europe/Copenhagen",
  },
  {
    name: "Biskra",
    country: "DZ",
    timezone: "Africa/Algiers",
  },
  {
    name: "Ambato",
    country: "EC",
    timezone: "America/Guayaquil",
  },
  {
    name: "Sinnūris",
    country: "EG",
    timezone: "Africa/Cairo",
  },
  {
    name: "Sabadell",
    country: "ES",
    timezone: "Europe/Madrid",
  },
  {
    name: "Salamanca",
    country: "ES",
    timezone: "Europe/Madrid",
  },
  {
    name: "Brugge",
    country: "BE",
    timezone: "Europe/Brussels",
  },
  {
    name: "Vila Velha",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Caraguatatuba",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Halifax",
    country: "CA",
    timezone: "America/Halifax",
  },
  {
    name: "Goma",
    country: "CD",
    timezone: "Africa/Lubumbashi",
  },
  {
    name: "Bouaké",
    country: "CI",
    timezone: "Africa/Abidjan",
  },
  {
    name: "Abobo",
    country: "CI",
    timezone: "Africa/Abidjan",
  },
  {
    name: "Shihezi",
    country: "CN",
    timezone: "Asia/Urumqi",
  },
  {
    name: "Yunfu",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Xiangtan",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Dongyang",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Wenchang",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Laixi",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Shouguang",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Nanbin",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Laizhou",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Jiazi",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Ningde",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Qionghai",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Fu’an",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Gunan",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Chuzhou",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Songyuan",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Lianhe",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Kaiyuan",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Gardez",
    country: "AF",
    timezone: "Asia/Kabul",
  },
  {
    name: "Klagenfurt am Wörthersee",
    country: "AT",
    timezone: "Europe/Vienna",
  },
  {
    name: "Prenzlauer Berg",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Elk Grove",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Lancaster",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Oakland",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Fort Collins",
    country: "US",
    timezone: "America/Denver",
  },
  {
    name: "Tacoma",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Cabimas",
    country: "VE",
    timezone: "America/Caracas",
  },
  {
    name: "Thanh Hóa",
    country: "VN",
    timezone: "Asia/Bangkok",
  },
  {
    name: "La Gi",
    country: "VN",
    timezone: "Asia/Ho_Chi_Minh",
  },
  {
    name: "Richards Bay",
    country: "ZA",
    timezone: "Africa/Johannesburg",
  },
  {
    name: "Polokwane",
    country: "ZA",
    timezone: "Africa/Johannesburg",
  },
  {
    name: "Kroonstad",
    country: "ZA",
    timezone: "Africa/Johannesburg",
  },
  {
    name: "Tlalpan",
    country: "MX",
    timezone: "America/Mexico_City",
  },
  {
    name: "Chilpancingo",
    country: "MX",
    timezone: "America/Mexico_City",
  },
  {
    name: "Guadalupe",
    country: "MX",
    timezone: "America/Mexico_City",
  },
  {
    name: "Ciudad General Escobedo",
    country: "MX",
    timezone: "America/Monterrey",
  },
  {
    name: "Celaya",
    country: "MX",
    timezone: "America/Mexico_City",
  },
  {
    name: "Kano",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "New Kingston",
    country: "JM",
    timezone: "America/Jamaica",
  },
  {
    name: "Yaizu",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Toyokawa",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Machida",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Kōfu",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Iwatsuki",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Inazawa",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Ichinomiya",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Asahikawa",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Iruma",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Pyongyang",
    country: "KP",
    timezone: "Asia/Pyongyang",
  },
  {
    name: "Shymkent",
    country: "KZ",
    timezone: "Asia/Almaty",
  },
  {
    name: "Sri Jayewardenepura Kotte",
    country: "LK",
    timezone: "Asia/Colombo",
  },
  {
    name: "Colombo",
    country: "LK",
    timezone: "Asia/Colombo",
  },
  {
    name: "Daugavpils",
    country: "LV",
    timezone: "Europe/Riga",
  },
  {
    name: "El Jadid",
    country: "MA",
    timezone: "Africa/Casablanca",
  },
  {
    name: "Port Louis",
    country: "MU",
    timezone: "Indian/Mauritius",
  },
  {
    name: "Matagalpa",
    country: "NI",
    timezone: "America/Managua",
  },
  {
    name: "Lahān",
    country: "NP",
    timezone: "Asia/Kathmandu",
  },
  {
    name: "Wellington",
    country: "NZ",
    timezone: "Pacific/Auckland",
  },
  {
    name: "Panamá",
    country: "PA",
    timezone: "America/Panama",
  },
  {
    name: "Tanza",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Antipolo",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Nawabshah",
    country: "PK",
    timezone: "Asia/Karachi",
  },
  {
    name: "Muridke",
    country: "PK",
    timezone: "Asia/Karachi",
  },
  {
    name: "Metz",
    country: "FR",
    timezone: "Europe/Paris",
  },
  {
    name: "Le Havre",
    country: "FR",
    timezone: "Europe/Paris",
  },
  {
    name: "Bordeaux",
    country: "FR",
    timezone: "Europe/Paris",
  },
  {
    name: "Netanya",
    country: "IL",
    timezone: "Asia/Jerusalem",
  },
  {
    name: "Verāval",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Vejalpur",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Siwān",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Sīkar",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Siliguri",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Sawāi Mādhopur",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Hāthras",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Etāwah",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Dhūlia",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Dewas",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Botād",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Alwar",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Agartala",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Greater Noida",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Lal Bahadur Nagar",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Deoli",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Baghdad",
    country: "IQ",
    timezone: "Asia/Baghdad",
  },
  {
    name: "An Nu‘mānīyah",
    country: "IQ",
    timezone: "Asia/Baghdad",
  },
  {
    name: "Al Fallūjah",
    country: "IQ",
    timezone: "Asia/Baghdad",
  },
  {
    name: "Al ‘Amārah",
    country: "IQ",
    timezone: "Asia/Baghdad",
  },
  {
    name: "Al Başrah al Qadīmah",
    country: "IQ",
    timezone: "Asia/Baghdad",
  },
  {
    name: "Sirjan",
    country: "IR",
    timezone: "Asia/Tehran",
  },
  {
    name: "Santa Lucía Cotzumalguapa",
    country: "GT",
    timezone: "America/Guatemala",
  },
  {
    name: "Győr",
    country: "HU",
    timezone: "Europe/Budapest",
  },
  {
    name: "Bandar Lampung",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Gorontalo",
    country: "ID",
    timezone: "Asia/Makassar",
  },
  {
    name: "Dumai",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Cirebon",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Cileunyi",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Cilacap",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Astanajapura",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Milton Keynes",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Leeds",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Gillingham",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Chesterfield",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Bolton",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Birmingham",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "Miami",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Winston-Salem",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Philadelphia",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "New South Memphis",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "Van",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Giresun",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Bursa",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Amasya",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Taoyuan City",
    country: "TW",
    timezone: "Asia/Taipei",
  },
  {
    name: "Dar es Salaam",
    country: "TZ",
    timezone: "Africa/Dar_es_Salaam",
  },
  {
    name: "Bobo-Dioulasso",
    country: "BF",
    timezone: "Africa/Ouagadougou",
  },
  {
    name: "Banfora",
    country: "BF",
    timezone: "Africa/Ouagadougou",
  },
  {
    name: "La Paz",
    country: "BO",
    timezone: "America/La_Paz",
  },
  {
    name: "São José dos Campos",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Paulínia",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Ibirité",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Florianópolis",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Cuiabá",
    country: "BR",
    timezone: "America/Cuiaba",
  },
  {
    name: "Colatina",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Americana",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Calgary",
    country: "CA",
    timezone: "America/Edmonton",
  },
  {
    name: "Coquitlam",
    country: "CA",
    timezone: "America/Vancouver",
  },
  {
    name: "Ottawa",
    country: "CA",
    timezone: "America/Toronto",
  },
  {
    name: "Toronto",
    country: "CA",
    timezone: "America/Toronto",
  },
  {
    name: "Kisangani",
    country: "CD",
    timezone: "Africa/Lubumbashi",
  },
  {
    name: "Kalemie",
    country: "CD",
    timezone: "Africa/Lubumbashi",
  },
  {
    name: "Basel",
    country: "CH",
    timezone: "Europe/Zurich",
  },
  {
    name: "Chattogram",
    country: "BD",
    timezone: "Asia/Dhaka",
  },
  {
    name: "Leuven",
    country: "BE",
    timezone: "Europe/Brussels",
  },
  {
    name: "Adelaide",
    country: "AU",
    timezone: "Australia/Adelaide",
  },
  {
    name: "Nijmegen",
    country: "NL",
    timezone: "Europe/Amsterdam",
  },
  {
    name: "Amersfoort",
    country: "NL",
    timezone: "Europe/Amsterdam",
  },
  {
    name: "Libertad",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Dagupan",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Malingao",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Shahkot",
    country: "PK",
    timezone: "Asia/Karachi",
  },
  {
    name: "Hyderabad",
    country: "PK",
    timezone: "Asia/Karachi",
  },
  {
    name: "Warsaw",
    country: "PL",
    timezone: "Europe/Warsaw",
  },
  {
    name: "Naha",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Matsumoto",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Kumagaya",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Kawasaki",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Iwakuni",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Sendai",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Mito",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Hitachi-Naka",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Jeonju",
    country: "KR",
    timezone: "Asia/Seoul",
  },
  {
    name: "Seogwipo",
    country: "KR",
    timezone: "Asia/Seoul",
  },
  {
    name: "Almaty",
    country: "KZ",
    timezone: "Asia/Almaty",
  },
  {
    name: "Tripoli",
    country: "LB",
    timezone: "Asia/Beirut",
  },
  {
    name: "Tobruk",
    country: "LY",
    timezone: "Africa/Tripoli",
  },
  {
    name: "Al Ajaylat",
    country: "LY",
    timezone: "Africa/Tripoli",
  },
  {
    name: "Al Jadīd",
    country: "LY",
    timezone: "Africa/Tripoli",
  },
  {
    name: "Setúbal",
    country: "PT",
    timezone: "Europe/Lisbon",
  },
  {
    name: "Oradea",
    country: "RO",
    timezone: "Europe/Bucharest",
  },
  {
    name: "San Pablo de las Salinas",
    country: "MX",
    timezone: "America/Mexico_City",
  },
  {
    name: "Chalco",
    country: "MX",
    timezone: "America/Mexico_City",
  },
  {
    name: "Fresnillo",
    country: "MX",
    timezone: "America/Mexico_City",
  },
  {
    name: "Colima",
    country: "MX",
    timezone: "America/Mexico_City",
  },
  {
    name: "Ciudad Obregón",
    country: "MX",
    timezone: "America/Hermosillo",
  },
  {
    name: "Lakhīmpur",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Jagādhri",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Hardoī",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Hāora",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Hābra",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Dehri",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Dārjiling",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Budaun",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Bathinda",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Bettiah",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Batāla",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Navi Mumbai",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Ashoknagar Kalyangarh",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Ramagundam",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Baqubah",
    country: "IQ",
    timezone: "Asia/Baghdad",
  },
  {
    name: "Kufa",
    country: "IQ",
    timezone: "Asia/Baghdad",
  },
  {
    name: "Golestān",
    country: "IR",
    timezone: "Asia/Tehran",
  },
  {
    name: "Bushehr",
    country: "IR",
    timezone: "Asia/Tehran",
  },
  {
    name: "Debrecen",
    country: "HU",
    timezone: "Europe/Budapest",
  },
  {
    name: "Percut",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Banda Aceh",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Salatiga",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Lubuklinggau",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Jember",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Bitung",
    country: "ID",
    timezone: "Asia/Makassar",
  },
  {
    name: "Kupang",
    country: "ID",
    timezone: "Asia/Makassar",
  },
  {
    name: "Sepang",
    country: "MY",
    timezone: "Asia/Kuala_Lumpur",
  },
  {
    name: "Kuching",
    country: "MY",
    timezone: "Asia/Kuching",
  },
  {
    name: "Lichinga",
    country: "MZ",
    timezone: "Africa/Maputo",
  },
  {
    name: "Uyo",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Inisa",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Igboho",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Efon-Alaaye",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Udaipur",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Tumkūr",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Sītāpur",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Raigarh",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Pimpri",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Pānīpat",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Mathura",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Chingola",
    country: "ZM",
    timezone: "Africa/Lusaka",
  },
  {
    name: "Allentown",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Pittsburgh",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Long Beach",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Albuquerque",
    country: "US",
    timezone: "America/Denver",
  },
  {
    name: "South Fulton",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Angren",
    country: "UZ",
    timezone: "Asia/Tashkent",
  },
  {
    name: "San Juan de los Morros",
    country: "VE",
    timezone: "America/Caracas",
  },
  {
    name: "San Carlos",
    country: "VE",
    timezone: "America/Caracas",
  },
  {
    name: "Ciudad Ojeda",
    country: "VE",
    timezone: "America/Caracas",
  },
  {
    name: "Carúpano",
    country: "VE",
    timezone: "America/Caracas",
  },
  {
    name: "Rạch Giá",
    country: "VN",
    timezone: "Asia/Ho_Chi_Minh",
  },
  {
    name: "Serpukhov",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Nazran’",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Izmaylovo",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Novosibirsk",
    country: "RU",
    timezone: "Asia/Novosibirsk",
  },
  {
    name: "Yuzhno-Sakhalinsk",
    country: "RU",
    timezone: "Asia/Sakhalin",
  },
  {
    name: "Göteborg",
    country: "SE",
    timezone: "Europe/Stockholm",
  },
  {
    name: "Dūmā",
    country: "SY",
    timezone: "Asia/Damascus",
  },
  {
    name: "Sokodé",
    country: "TG",
    timezone: "Africa/Lome",
  },
  {
    name: "Sfax",
    country: "TN",
    timezone: "Africa/Tunis",
  },
  {
    name: "Zhongshan",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Sincelejo",
    country: "CO",
    timezone: "America/Bogota",
  },
  {
    name: "Ocaña",
    country: "CO",
    timezone: "America/Bogota",
  },
  {
    name: "Bayamo",
    country: "CU",
    timezone: "America/Havana",
  },
  {
    name: "Kawm Umbū",
    country: "EG",
    timezone: "Africa/Cairo",
  },
  {
    name: "Abū Tīj",
    country: "EG",
    timezone: "Africa/Cairo",
  },
  {
    name: "Palma",
    country: "ES",
    timezone: "Europe/Madrid",
  },
  {
    name: "Jaén",
    country: "ES",
    timezone: "Europe/Madrid",
  },
  {
    name: "Vigo",
    country: "ES",
    timezone: "Europe/Madrid",
  },
  {
    name: "Terrassa",
    country: "ES",
    timezone: "Europe/Madrid",
  },
  {
    name: "Walsall",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Rotherham",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Poole",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Newport",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Ipswich",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Exeter",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Burton upon Trent",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Basingstoke",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Kankan",
    country: "GN",
    timezone: "Africa/Conakry",
  },
  {
    name: "Leverkusen",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Hildesheim",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Kaifeng",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Heze",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Guixi",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Dingxi",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Bishan",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Honggang",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Gongzhuling",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Anda",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Tacheng",
    country: "CN",
    timezone: "Asia/Urumqi",
  },
  {
    name: "Yulin",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Shiqi",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Puyang Chengguanzhen",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Nanjing",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Tijuana",
    country: "MX",
    timezone: "America/Tijuana",
  },
  {
    name: "Ar Rifā‘",
    country: "BH",
    timezone: "Asia/Bahrain",
  },
  {
    name: "Bujumbura",
    country: "BI",
    timezone: "Africa/Bujumbura",
  },
  {
    name: "São Luís",
    country: "BR",
    timezone: "America/Fortaleza",
  },
  {
    name: "Vitória da Conquista",
    country: "BR",
    timezone: "America/Bahia",
  },
  {
    name: "Várzea Grande",
    country: "BR",
    timezone: "America/Cuiaba",
  },
  {
    name: "São Carlos",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Porto Seguro",
    country: "BR",
    timezone: "America/Bahia",
  },
  {
    name: "Mogi Guaçu",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Governador Valadares",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Franca",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Conselheiro Lafaiete",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Maladziečna",
    country: "BY",
    timezone: "Europe/Minsk",
  },
  {
    name: "Barysaw",
    country: "BY",
    timezone: "Europe/Minsk",
  },
  {
    name: "Dartmouth",
    country: "CA",
    timezone: "America/Halifax",
  },
  {
    name: "Québec",
    country: "CA",
    timezone: "America/Toronto",
  },
  {
    name: "Dolisie",
    country: "CG",
    timezone: "Africa/Brazzaville",
  },
  {
    name: "Sinfra",
    country: "CI",
    timezone: "Africa/Abidjan",
  },
  {
    name: "Marcory",
    country: "CI",
    timezone: "Africa/Abidjan",
  },
  {
    name: "Brescia",
    country: "IT",
    timezone: "Europe/Rome",
  },
  {
    name: "Yono",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Tochigi",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Kawaguchi",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Tachikawa",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Bucheon-si",
    country: "KR",
    timezone: "Asia/Seoul",
  },
  {
    name: "Icheon-si",
    country: "KR",
    timezone: "Asia/Seoul",
  },
  {
    name: "Yeosu",
    country: "KR",
    timezone: "Asia/Seoul",
  },
  {
    name: "Berdyansk",
    country: "UA",
    timezone: "Europe/Kyiv",
  },
  {
    name: "Lakeland",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Independence",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "North Charleston",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "East Hampton",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "New Haven",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Davenport",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "Fenghuang",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Liupanshui",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Montería",
    country: "CO",
    timezone: "America/Bogota",
  },
  {
    name: "Havana",
    country: "CU",
    timezone: "America/Havana",
  },
  {
    name: "Ciego de Ávila",
    country: "CU",
    timezone: "America/Havana",
  },
  {
    name: "Ankara",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Mustafakemalpaşa",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Esenler",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Çankaya",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Kampung Pasir Gudang Baru",
    country: "MY",
    timezone: "Asia/Kuala_Lumpur",
  },
  {
    name: "Jos",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Ibadan",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Fort Wayne",
    country: "US",
    timezone: "America/Indiana/Indianapolis",
  },
  {
    name: "Boston",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Ufa",
    country: "RU",
    timezone: "Asia/Yekaterinburg",
  },
  {
    name: "East Flatbush",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Madison",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "Surprise",
    country: "US",
    timezone: "America/Phoenix",
  },
  {
    name: "Fresno",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Glendale",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Inglewood",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Torrance",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Visalia",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Colorado Springs",
    country: "US",
    timezone: "America/Denver",
  },
  {
    name: "Salt Lake City",
    country: "US",
    timezone: "America/Denver",
  },
  {
    name: "Vancouver",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "East Harlem",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Shahrisabz",
    country: "UZ",
    timezone: "Asia/Samarkand",
  },
  {
    name: "Puerto Cabello",
    country: "VE",
    timezone: "America/Caracas",
  },
  {
    name: "Ciudad Bolívar",
    country: "VE",
    timezone: "America/Caracas",
  },
  {
    name: "Cam Ranh",
    country: "VN",
    timezone: "Asia/Ho_Chi_Minh",
  },
  {
    name: "Cẩm Phả",
    country: "VN",
    timezone: "Asia/Bangkok",
  },
  {
    name: "Ramenki",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Ochakovo-Matveyevskoye",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Dimitrovgrad",
    country: "RU",
    timezone: "Europe/Ulyanovsk",
  },
  {
    name: "Cherepovets",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Leninsk-Kuznetsky",
    country: "RU",
    timezone: "Asia/Novokuznetsk",
  },
  {
    name: "Bratsk",
    country: "RU",
    timezone: "Asia/Irkutsk",
  },
  {
    name: "Gisenyi",
    country: "RW",
    timezone: "Africa/Kigali",
  },
  {
    name: "Mecca",
    country: "SA",
    timezone: "Asia/Riyadh",
  },
  {
    name: "Kosti",
    country: "SD",
    timezone: "Africa/Khartoum",
  },
  {
    name: "Freetown",
    country: "SL",
    timezone: "Africa/Freetown",
  },
  {
    name: "Daşoguz",
    country: "TM",
    timezone: "Asia/Ashgabat",
  },
  {
    name: "Bizerte",
    country: "TN",
    timezone: "Africa/Tunis",
  },
  {
    name: "Botshabelo",
    country: "ZA",
    timezone: "Africa/Johannesburg",
  },
  {
    name: "Paarl",
    country: "ZA",
    timezone: "Africa/Johannesburg",
  },
  {
    name: "Mokotów",
    country: "PL",
    timezone: "Europe/Warsaw",
  },
  {
    name: "Katowice",
    country: "PL",
    timezone: "Europe/Warsaw",
  },
  {
    name: "Khān Yūnis",
    country: "PS",
    timezone: "Asia/Gaza",
  },
  {
    name: "Ploieşti",
    country: "RO",
    timezone: "Europe/Bucharest",
  },
  {
    name: "Zelenograd",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Vologda",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Ulhasnagar",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Shāhjānpur",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Robertsonpet",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Khandwa",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Khammam",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Katihar",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Kāmārhāti",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Jaunpur",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Hosūr",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Hazāribāgh",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Gyānpur",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Faridabad",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Dinapore",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Kolkata",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Alandur",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Aizawl",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Serilingampalle",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Karbala",
    country: "IQ",
    timezone: "Asia/Baghdad",
  },
  {
    name: "Yazd",
    country: "IR",
    timezone: "Asia/Tehran",
  },
  {
    name: "Bandar-e Anzalī",
    country: "IR",
    timezone: "Asia/Tehran",
  },
  {
    name: "Milan",
    country: "IT",
    timezone: "Europe/Rome",
  },
  {
    name: "Athens",
    country: "GR",
    timezone: "Europe/Athens",
  },
  {
    name: "Binjai",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Jakarta",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Denpasar",
    country: "ID",
    timezone: "Asia/Makassar",
  },
  {
    name: "Cileungsir",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Bangil",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Cikupa",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Batam",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Pita Kotte",
    country: "LK",
    timezone: "Asia/Colombo",
  },
  {
    name: "Al Khums",
    country: "LY",
    timezone: "Africa/Tripoli",
  },
  {
    name: "Tangier",
    country: "MA",
    timezone: "Africa/Casablanca",
  },
  {
    name: "Mawlamyine",
    country: "MM",
    timezone: "Asia/Yangon",
  },
  {
    name: "Kēng Tung",
    country: "MM",
    timezone: "Asia/Yangon",
  },
  {
    name: "Nay Pyi Taw",
    country: "MM",
    timezone: "Asia/Yangon",
  },
  {
    name: "Kyain Seikgyi Township",
    country: "MM",
    timezone: "Asia/Yangon",
  },
  {
    name: "Male",
    country: "MV",
    timezone: "Indian/Maldives",
  },
  {
    name: "Managua",
    country: "NI",
    timezone: "America/Managua",
  },
  {
    name: "Bharatpur",
    country: "NP",
    timezone: "Asia/Kathmandu",
  },
  {
    name: "Şalālah",
    country: "OM",
    timezone: "Asia/Muscat",
  },
  {
    name: "Huánuco",
    country: "PE",
    timezone: "America/Lima",
  },
  {
    name: "Tarlac City",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Navotas",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Lipa City",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Cadiz",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Butuan",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Bagong Silangan",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Rawalpindi",
    country: "PK",
    timezone: "Asia/Karachi",
  },
  {
    name: "New Mirpur",
    country: "PK",
    timezone: "Asia/Karachi",
  },
  {
    name: "Khushāb",
    country: "PK",
    timezone: "Asia/Karachi",
  },
  {
    name: "Karachi",
    country: "PK",
    timezone: "Asia/Karachi",
  },
  {
    name: "Tiaret",
    country: "DZ",
    timezone: "Africa/Algiers",
  },
  {
    name: "Sidi Bel Abbès",
    country: "DZ",
    timezone: "Africa/Algiers",
  },
  {
    name: "Riobamba",
    country: "EC",
    timezone: "America/Guayaquil",
  },
  {
    name: "Tallinn",
    country: "EE",
    timezone: "Europe/Tallinn",
  },
  {
    name: "Maghāghah",
    country: "EG",
    timezone: "Africa/Cairo",
  },
  {
    name: "Sodo",
    country: "ET",
    timezone: "Africa/Addis_Ababa",
  },
  {
    name: "Osorno",
    country: "CL",
    timezone: "America/Santiago",
  },
  {
    name: "Aral",
    country: "CN",
    timezone: "Asia/Urumqi",
  },
  {
    name: "Xinghua",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Yangzhou",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Shangrao",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Xinzhou",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Xingtai",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Xiangyang",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Shaping",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Qujing",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Pingdu",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Nanning",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Huayin",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Huainan",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Lijiang",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Changle",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Binzhou",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Wuyishan",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Yueyang",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Nehe",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Nanpiao",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Fuxin",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Tovuz",
    country: "AZ",
    timezone: "Asia/Baku",
  },
  {
    name: "Dhaka",
    country: "BD",
    timezone: "Asia/Dhaka",
  },
  {
    name: "Bhairab Bāzār",
    country: "BD",
    timezone: "Asia/Dhaka",
  },
  {
    name: "Dinājpur",
    country: "BD",
    timezone: "Asia/Dhaka",
  },
  {
    name: "Cox’s Bāzār",
    country: "BD",
    timezone: "Asia/Dhaka",
  },
  {
    name: "Puthia",
    country: "BD",
    timezone: "Asia/Dhaka",
  },
  {
    name: "Mazār-e Sharīf",
    country: "AF",
    timezone: "Asia/Kabul",
  },
  {
    name: "Mar del Plata",
    country: "AR",
    timezone: "America/Argentina/Buenos_Aires",
  },
  {
    name: "Salta",
    country: "AR",
    timezone: "America/Argentina/Salta",
  },
  {
    name: "Cairns",
    country: "AU",
    timezone: "Australia/Brisbane",
  },
  {
    name: "San Mateo",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Valencia",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Vista",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Maracaibo",
    country: "VE",
    timezone: "America/Caracas",
  },
  {
    name: "San Fernando de Apure",
    country: "VE",
    timezone: "America/Caracas",
  },
  {
    name: "Yên Vinh",
    country: "VN",
    timezone: "Asia/Bangkok",
  },
  {
    name: "Bạc Liêu",
    country: "VN",
    timezone: "Asia/Ho_Chi_Minh",
  },
  {
    name: "Newcastle",
    country: "ZA",
    timezone: "Africa/Johannesburg",
  },
  {
    name: "Lusaka",
    country: "ZM",
    timezone: "Africa/Lusaka",
  },
  {
    name: "Stara Zagora",
    country: "BG",
    timezone: "Europe/Sofia",
  },
  {
    name: "Cochabamba",
    country: "BO",
    timezone: "America/La_Paz",
  },
  {
    name: "Recife",
    country: "BR",
    timezone: "America/Recife",
  },
  {
    name: "Pelotas",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Paranaguá",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Palhoça",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Novo Hamburgo",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Hortolândia",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Ferraz de Vasconcelos",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Esmeraldas",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Contagem",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Campinas",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Cachoeirinha",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Cabo Frio",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Betim",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Barreiras",
    country: "BR",
    timezone: "America/Bahia",
  },
  {
    name: "Valparaíso",
    country: "CL",
    timezone: "America/Santiago",
  },
  {
    name: "Changshu",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Bayan Nur",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Liangping",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Floridablanca",
    country: "CO",
    timezone: "America/Bogota",
  },
  {
    name: "Barranquilla",
    country: "CO",
    timezone: "America/Bogota",
  },
  {
    name: "Prague",
    country: "CZ",
    timezone: "Europe/Prague",
  },
  {
    name: "Brno",
    country: "CZ",
    timezone: "Europe/Prague",
  },
  {
    name: "Stuttgart",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "San Francisco de Macorís",
    country: "DO",
    timezone: "America/Santo_Domingo",
  },
  {
    name: "Ouargla",
    country: "DZ",
    timezone: "Africa/Algiers",
  },
  {
    name: "Oran",
    country: "DZ",
    timezone: "Africa/Algiers",
  },
  {
    name: "Portoviejo",
    country: "EC",
    timezone: "America/Guayaquil",
  },
  {
    name: "Mīt Ghamr",
    country: "EG",
    timezone: "Africa/Cairo",
  },
  {
    name: "Las Palmas de Gran Canaria",
    country: "ES",
    timezone: "Atlantic/Canary",
  },
  {
    name: "Zaragoza",
    country: "ES",
    timezone: "Europe/Madrid",
  },
  {
    name: "Oviedo",
    country: "ES",
    timezone: "Europe/Madrid",
  },
  {
    name: "Jijiga",
    country: "ET",
    timezone: "Africa/Addis_Ababa",
  },
  {
    name: "Rājshāhi",
    country: "BD",
    timezone: "Asia/Dhaka",
  },
  {
    name: "Rangpur",
    country: "BD",
    timezone: "Asia/Dhaka",
  },
  {
    name: "Schaerbeek",
    country: "BE",
    timezone: "Europe/Brussels",
  },
  {
    name: "Liège",
    country: "BE",
    timezone: "Europe/Brussels",
  },
  {
    name: "Mülheim",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Ludwigshafen am Rhein",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Lübeck",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Jena",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Dortmund",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Concepción",
    country: "CL",
    timezone: "America/Santiago",
  },
  {
    name: "Tengyue",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Aksu",
    country: "CN",
    timezone: "Asia/Urumqi",
  },
  {
    name: "Zigong",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Zhenping Chengguanzhen",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Zaoyang",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Kunshan",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Yichang",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Xinji",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Xindi",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Sanming",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Guang’an",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Nantong",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Ma’anshan",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Jingzhou",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Jingling",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Huacheng",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Gaozhou",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Fuzhou",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Encheng",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Dongying",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Dongtai",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Changyuan",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Basuo",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Yanji",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Jining",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Fushun",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Dongling",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Baicheng",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "The Hague",
    country: "NL",
    timezone: "Europe/Amsterdam",
  },
  {
    name: "Almere Stad",
    country: "NL",
    timezone: "Europe/Amsterdam",
  },
  {
    name: "Pucallpa",
    country: "PE",
    timezone: "America/Lima",
  },
  {
    name: "Chiclayo",
    country: "PE",
    timezone: "America/Lima",
  },
  {
    name: "Pasay",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Iloilo",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Iligan City",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Bayawan",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Quetta",
    country: "PK",
    timezone: "Asia/Karachi",
  },
  {
    name: "Dadu",
    country: "PK",
    timezone: "Asia/Karachi",
  },
  {
    name: "Abbottabad",
    country: "PK",
    timezone: "Asia/Karachi",
  },
  {
    name: "Shakhty",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Orsk",
    country: "RU",
    timezone: "Asia/Yekaterinburg",
  },
  {
    name: "Orël",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Obninsk",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Cheboksary",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Berezniki",
    country: "RU",
    timezone: "Asia/Yekaterinburg",
  },
  {
    name: "Västerås",
    country: "SE",
    timezone: "Europe/Stockholm",
  },
  {
    name: "Bo",
    country: "SL",
    timezone: "Africa/Freetown",
  },
  {
    name: "Ziguinchor",
    country: "SN",
    timezone: "Africa/Dakar",
  },
  {
    name: "Latakia",
    country: "SY",
    timezone: "Asia/Damascus",
  },
  {
    name: "Ashgabat",
    country: "TM",
    timezone: "Asia/Ashgabat",
  },
  {
    name: "Ağrı",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Isparta",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Denizli",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Zeytinburnu",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "İzmit",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Tainan",
    country: "TW",
    timezone: "Asia/Taipei",
  },
  {
    name: "Timişoara",
    country: "RO",
    timezone: "Europe/Bucharest",
  },
  {
    name: "Piatra Neamţ",
    country: "RO",
    timezone: "Europe/Bucharest",
  },
  {
    name: "Sector 5",
    country: "RO",
    timezone: "Europe/Bucharest",
  },
  {
    name: "Horlivka",
    country: "UA",
    timezone: "Europe/Kyiv",
  },
  {
    name: "West Palm Beach",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Metairie",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "Nashville",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "Lewisville",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "Cedar Rapids",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "Rockford",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "Białystok",
    country: "PL",
    timezone: "Europe/Warsaw",
  },
  {
    name: "Gliwice",
    country: "PL",
    timezone: "Europe/Warsaw",
  },
  {
    name: "Lowell",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "New Bedford",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Pachuca de Soto",
    country: "MX",
    timezone: "America/Mexico_City",
  },
  {
    name: "Nuevo Laredo",
    country: "MX",
    timezone: "America/Matamoros",
  },
  {
    name: "Jiutepec",
    country: "MX",
    timezone: "America/Mexico_City",
  },
  {
    name: "Ciudad del Carmen",
    country: "MX",
    timezone: "America/Merida",
  },
  {
    name: "San Pedro Garza García",
    country: "MX",
    timezone: "America/Monterrey",
  },
  {
    name: "Ikeja",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Funtua",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Atsugi",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Akashi",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Yao",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Urayasu",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Kitakyushu",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Hitachi",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Kuwana",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Chungju",
    country: "KR",
    timezone: "Asia/Seoul",
  },
  {
    name: "Anyang-si",
    country: "KR",
    timezone: "Asia/Seoul",
  },
  {
    name: "Kostanay",
    country: "KZ",
    timezone: "Asia/Qostanay",
  },
  {
    name: "Az Zāwīyah",
    country: "LY",
    timezone: "Africa/Tripoli",
  },
  {
    name: "Beni Mellal",
    country: "MA",
    timezone: "Africa/Casablanca",
  },
  {
    name: "Fianarantsoa",
    country: "MG",
    timezone: "Indian/Antananarivo",
  },
  {
    name: "Pakokku",
    country: "MM",
    timezone: "Asia/Yangon",
  },
  {
    name: "Beau Bassin-Rose Hill",
    country: "MU",
    timezone: "Indian/Mauritius",
  },
  {
    name: "Swansea",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Sutton Coldfield",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Sunderland",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Jammu",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Jalgaon",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Gondiā",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Fīrozābād",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Farrukhābād",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Erode",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Dibrugarh",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Damoh",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Mumbai",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Bhīmavaram",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Bharatpur",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Bastī",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Bālurghāt",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Alappuzha",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Noida",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "As Samawah",
    country: "IQ",
    timezone: "Asia/Baghdad",
  },
  {
    name: "Nasiriyah",
    country: "IQ",
    timezone: "Asia/Baghdad",
  },
  {
    name: "Kahrīz",
    country: "IR",
    timezone: "Asia/Tehran",
  },
  {
    name: "Qarchak",
    country: "IR",
    timezone: "Asia/Tehran",
  },
  {
    name: "Khorramabad",
    country: "IR",
    timezone: "Asia/Tehran",
  },
  {
    name: "Gorgān",
    country: "IR",
    timezone: "Asia/Tehran",
  },
  {
    name: "Palermo",
    country: "IT",
    timezone: "Europe/Rome",
  },
  {
    name: "Pisa",
    country: "IT",
    timezone: "Europe/Rome",
  },
  {
    name: "Thessaloníki",
    country: "GR",
    timezone: "Europe/Athens",
  },
  {
    name: "Totonicapán",
    country: "GT",
    timezone: "America/Guatemala",
  },
  {
    name: "Victoria",
    country: "HK",
    timezone: "Asia/Hong_Kong",
  },
  {
    name: "Miskolc",
    country: "HU",
    timezone: "Europe/Budapest",
  },
  {
    name: "Budapest III. kerület",
    country: "HU",
    timezone: "Europe/Budapest",
  },
  {
    name: "Tanjung Pandan",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Surakarta",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Sampit",
    country: "ID",
    timezone: "Asia/Pontianak",
  },
  {
    name: "Pamanukan",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Jombang",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Cikarang",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Ciampea",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Banjarmasin",
    country: "ID",
    timezone: "Asia/Makassar",
  },
  {
    name: "Southend-on-Sea",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Luton",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Brighton",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Mendip",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Tbilisi",
    country: "GE",
    timezone: "Asia/Tbilisi",
  },
  {
    name: "Cape Coast",
    country: "GH",
    timezone: "Africa/Accra",
  },
  {
    name: "Kindia",
    country: "GN",
    timezone: "Africa/Conakry",
  },
  {
    name: "Bet Shemesh",
    country: "IL",
    timezone: "Asia/Jerusalem",
  },
  {
    name: "Unnāo",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Suriāpet",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Rewa",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Puri",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Pudukkottai",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Panvel",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Kulti",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Jalālābād",
    country: "AF",
    timezone: "Asia/Kabul",
  },
  {
    name: "Salzburg",
    country: "AT",
    timezone: "Europe/Vienna",
  },
  {
    name: "Logan City",
    country: "AU",
    timezone: "Australia/Brisbane",
  },
  {
    name: "Bergisch Gladbach",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Santo Domingo",
    country: "DO",
    timezone: "America/Santo_Domingo",
  },
  {
    name: "San Cristóbal",
    country: "DO",
    timezone: "America/Santo_Domingo",
  },
  {
    name: "Ţalkhā",
    country: "EG",
    timezone: "Africa/Cairo",
  },
  {
    name: "Bilqās",
    country: "EG",
    timezone: "Africa/Cairo",
  },
  {
    name: "Zagazig",
    country: "EG",
    timezone: "Africa/Cairo",
  },
  {
    name: "Al Manzalah",
    country: "EG",
    timezone: "Africa/Cairo",
  },
  {
    name: "Murcia",
    country: "ES",
    timezone: "Europe/Madrid",
  },
  {
    name: "Parla",
    country: "ES",
    timezone: "Europe/Madrid",
  },
  {
    name: "Gràcia",
    country: "ES",
    timezone: "Europe/Madrid",
  },
  {
    name: "Ordos",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Yangcheng",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Buenaventura",
    country: "CO",
    timezone: "America/Bogota",
  },
  {
    name: "Limassol",
    country: "CY",
    timezone: "Asia/Nicosia",
  },
  {
    name: "Besançon",
    country: "FR",
    timezone: "Europe/Paris",
  },
  {
    name: "Argenteuil",
    country: "FR",
    timezone: "Europe/Paris",
  },
  {
    name: "Hāpur",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Gaya",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Chhindwāra",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Bulandshahr",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Bengaluru",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Bahraigh",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Shivaji Nagar",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Mulugu",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Sabzevar",
    country: "IR",
    timezone: "Asia/Tehran",
  },
  {
    name: "Naz̧arābād",
    country: "IR",
    timezone: "Asia/Tehran",
  },
  {
    name: "Khowy",
    country: "IR",
    timezone: "Asia/Tehran",
  },
  {
    name: "Reykjavík",
    country: "IS",
    timezone: "Atlantic/Reykjavik",
  },
  {
    name: "Turin",
    country: "IT",
    timezone: "Europe/Rome",
  },
  {
    name: "Sunggal",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Medan",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Tasikmalaya",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Rengasdengklok",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Pekalongan",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Arjawinangun",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Mannheim",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Freiburg",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Stockport",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Kingston upon Hull",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Edinburgh",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Eastbourne",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Ramat Gan",
    country: "IL",
    timezone: "Asia/Jerusalem",
  },
  {
    name: "Kfar Saba",
    country: "IL",
    timezone: "Asia/Jerusalem",
  },
  {
    name: "Yavatmāl",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Tiruvannāmalai",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Sonīpat",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Rānipet",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Raipur",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Pātan",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Morādābād",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Korba",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Libreville",
    country: "GA",
    timezone: "Africa/Libreville",
  },
  {
    name: "Charlottenburg",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Bottrop",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Bergedorf",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Santiago de los Caballeros",
    country: "DO",
    timezone: "America/Santo_Domingo",
  },
  {
    name: "Mostaganem",
    country: "DZ",
    timezone: "Africa/Algiers",
  },
  {
    name: "Algiers",
    country: "DZ",
    timezone: "Africa/Algiers",
  },
  {
    name: "Girga",
    country: "EG",
    timezone: "Africa/Cairo",
  },
  {
    name: "Alexandria",
    country: "EG",
    timezone: "Africa/Cairo",
  },
  {
    name: "Arish",
    country: "EG",
    timezone: "Africa/Cairo",
  },
  {
    name: "Telde",
    country: "ES",
    timezone: "Atlantic/Canary",
  },
  {
    name: "Badajoz",
    country: "ES",
    timezone: "Europe/Madrid",
  },
  {
    name: "Gijón",
    country: "ES",
    timezone: "Europe/Madrid",
  },
  {
    name: "Bishoftu",
    country: "ET",
    timezone: "Africa/Addis_Ababa",
  },
  {
    name: "Alto Hospicio",
    country: "CL",
    timezone: "America/Santiago",
  },
  {
    name: "Garoua",
    country: "CM",
    timezone: "Africa/Douala",
  },
  {
    name: "Hotan",
    country: "CN",
    timezone: "Asia/Urumqi",
  },
  {
    name: "Xuchang",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Xi’an",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Changde",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Fuding",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Shaoguan",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Linshui",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Lichuan",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Dengzhou",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Fendou",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Lianshan",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Jilin",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Fengcheng",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Bei’an",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Lankaran",
    country: "AZ",
    timezone: "Asia/Baku",
  },
  {
    name: "Mingelchaur",
    country: "AZ",
    timezone: "Asia/Baku",
  },
  {
    name: "Bagerhat",
    country: "BD",
    timezone: "Asia/Dhaka",
  },
  {
    name: "Pābna",
    country: "BD",
    timezone: "Asia/Dhaka",
  },
  {
    name: "Bogra",
    country: "BD",
    timezone: "Asia/Dhaka",
  },
  {
    name: "Gent",
    country: "BE",
    timezone: "Europe/Brussels",
  },
  {
    name: "Kassel",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Musaffah",
    country: "AE",
    timezone: "Asia/Dubai",
  },
  {
    name: "Lobito",
    country: "AO",
    timezone: "Africa/Luanda",
  },
  {
    name: "Cuito",
    country: "AO",
    timezone: "Africa/Luanda",
  },
  {
    name: "Santa María",
    country: "AR",
    timezone: "America/Argentina/Buenos_Aires",
  },
  {
    name: "Mandurah",
    country: "AU",
    timezone: "Australia/Perth",
  },
  {
    name: "Townsville",
    country: "AU",
    timezone: "Australia/Brisbane",
  },
  {
    name: "Brisbane",
    country: "AU",
    timezone: "Australia/Brisbane",
  },
  {
    name: "Reading",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Glasgow",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Enfield Town",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Dagenham",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Peristéri",
    country: "GR",
    timezone: "Europe/Athens",
  },
  {
    name: "Fengcheng",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Yunlong",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Santa Marta",
    country: "CO",
    timezone: "America/Bogota",
  },
  {
    name: "Piedecuesta",
    country: "CO",
    timezone: "America/Bogota",
  },
  {
    name: "Cartagena",
    country: "CO",
    timezone: "America/Bogota",
  },
  {
    name: "Santa Clara",
    country: "CU",
    timezone: "America/Havana",
  },
  {
    name: "Holguín",
    country: "CU",
    timezone: "America/Havana",
  },
  {
    name: "Cerro",
    country: "CU",
    timezone: "America/Havana",
  },
  {
    name: "Natal",
    country: "BR",
    timezone: "America/Fortaleza",
  },
  {
    name: "Viamão",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Suzano",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "São Caetano do Sul",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Santa Bárbara d'Oeste",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Guarulhos",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Coronel Fabriciano",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Barbacena",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Manaus",
    country: "BR",
    timezone: "America/Manaus",
  },
  {
    name: "Jaboatão dos Guararapes",
    country: "BR",
    timezone: "America/Recife",
  },
  {
    name: "Edmonton",
    country: "CA",
    timezone: "America/Edmonton",
  },
  {
    name: "Moncton",
    country: "CA",
    timezone: "America/Moncton",
  },
  {
    name: "Kindu",
    country: "CD",
    timezone: "Africa/Lubumbashi",
  },
  {
    name: "Kananga",
    country: "CD",
    timezone: "Africa/Lubumbashi",
  },
  {
    name: "Bimbo",
    country: "CF",
    timezone: "Africa/Bangui",
  },
  {
    name: "San-Pédro",
    country: "CI",
    timezone: "Africa/Abidjan",
  },
  {
    name: "Korhogo",
    country: "CI",
    timezone: "Africa/Abidjan",
  },
  {
    name: "Séguéla",
    country: "CI",
    timezone: "Africa/Abidjan",
  },
  {
    name: "Karol Bāgh",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Gurgaon",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Dam Dam",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Dimāpur",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Badlapur",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Amroha",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Maheshtala",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Al Kūt",
    country: "IQ",
    timezone: "Asia/Baghdad",
  },
  {
    name: "Rasht",
    country: "IR",
    timezone: "Asia/Tehran",
  },
  {
    name: "Orūmīyeh",
    country: "IR",
    timezone: "Asia/Tehran",
  },
  {
    name: "Malāyer",
    country: "IR",
    timezone: "Asia/Tehran",
  },
  {
    name: "Īlām",
    country: "IR",
    timezone: "Asia/Tehran",
  },
  {
    name: "Bābol",
    country: "IR",
    timezone: "Asia/Tehran",
  },
  {
    name: "Zahedan",
    country: "IR",
    timezone: "Asia/Tehran",
  },
  {
    name: "Rimini",
    country: "IT",
    timezone: "Europe/Rome",
  },
  {
    name: "Reggio nell'Emilia",
    country: "IT",
    timezone: "Europe/Rome",
  },
  {
    name: "Kowloon",
    country: "HK",
    timezone: "Asia/Hong_Kong",
  },
  {
    name: "Ternate",
    country: "ID",
    timezone: "Asia/Jayapura",
  },
  {
    name: "Kendari",
    country: "ID",
    timezone: "Asia/Makassar",
  },
  {
    name: "Indramayu",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Balikpapan",
    country: "ID",
    timezone: "Asia/Makassar",
  },
  {
    name: "Bat Yam",
    country: "IL",
    timezone: "Asia/Jerusalem",
  },
  {
    name: "Thānesar",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Tambaram",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Shimoga",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Shillong",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Nashik",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Morbi",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Machilīpatnam",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Lucknow",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Birgañj",
    country: "NP",
    timezone: "Asia/Kathmandu",
  },
  {
    name: "Muscat",
    country: "OM",
    timezone: "Asia/Muscat",
  },
  {
    name: "Santol",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Santa Cruz",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "San Pablo",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "San Fernando",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Paranaque City",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Mantampay",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Kabankalan",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Rahim Yar Khan",
    country: "PK",
    timezone: "Asia/Karachi",
  },
  {
    name: "Emalahleni",
    country: "ZA",
    timezone: "Africa/Johannesburg",
  },
  {
    name: "Mabopane",
    country: "ZA",
    timezone: "Africa/Johannesburg",
  },
  {
    name: "Solikamsk",
    country: "RU",
    timezone: "Asia/Yekaterinburg",
  },
  {
    name: "Saransk",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Podolsk",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Kaluga",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Korolev",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Armavir",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Prokop’yevsk",
    country: "RU",
    timezone: "Asia/Novokuznetsk",
  },
  {
    name: "Kyzyl",
    country: "RU",
    timezone: "Asia/Krasnoyarsk",
  },
  {
    name: "Khabarovsk",
    country: "RU",
    timezone: "Asia/Vladivostok",
  },
  {
    name: "Irkutsk",
    country: "RU",
    timezone: "Asia/Irkutsk",
  },
  {
    name: "Sinnar",
    country: "SD",
    timezone: "Africa/Khartoum",
  },
  {
    name: "Ljubljana",
    country: "SI",
    timezone: "Europe/Ljubljana",
  },
  {
    name: "Bratislava",
    country: "SK",
    timezone: "Europe/Bratislava",
  },
  {
    name: "Kismayo",
    country: "SO",
    timezone: "Africa/Mogadishu",
  },
  {
    name: "Manzini",
    country: "SZ",
    timezone: "Africa/Mbabane",
  },
  {
    name: "Kırıkkale",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Batman",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Alanya",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Karabük",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Sultanbeyli",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Yuanlin",
    country: "TW",
    timezone: "Asia/Taipei",
  },
  {
    name: "Tanga",
    country: "TZ",
    timezone: "Africa/Dar_es_Salaam",
  },
  {
    name: "Takasaki",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Ōita",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Gifu-shi",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Akita",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Otaru",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Kakamega",
    country: "KE",
    timezone: "Africa/Nairobi",
  },
  {
    name: "Battambang",
    country: "KH",
    timezone: "Asia/Phnom_Penh",
  },
  {
    name: "Jeju City",
    country: "KR",
    timezone: "Asia/Seoul",
  },
  {
    name: "Şabāḩ as Sālim",
    country: "KW",
    timezone: "Asia/Kuwait",
  },
  {
    name: "Tyre",
    country: "LB",
    timezone: "Asia/Beirut",
  },
  {
    name: "Maseru",
    country: "LS",
    timezone: "Africa/Maseru",
  },
  {
    name: "Al Hoceïma",
    country: "MA",
    timezone: "Africa/Casablanca",
  },
  {
    name: "Agadir",
    country: "MA",
    timezone: "Africa/Casablanca",
  },
  {
    name: "Ulan Bator",
    country: "MN",
    timezone: "Asia/Ulaanbaatar",
  },
  {
    name: "Zacatecas",
    country: "MX",
    timezone: "America/Mexico_City",
  },
  {
    name: "Kota Bharu",
    country: "MY",
    timezone: "Asia/Kuala_Lumpur",
  },
  {
    name: "Nacala",
    country: "MZ",
    timezone: "Africa/Maputo",
  },
  {
    name: "Umuahia",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Ogbomoso",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Jimeta",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Buguma",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Buffalo",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Manhattan",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Peoria",
    country: "US",
    timezone: "America/Phoenix",
  },
  {
    name: "Bakersfield",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "El Cajon",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Irvine",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Temecula",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Billings",
    country: "US",
    timezone: "America/Denver",
  },
  {
    name: "Turmero",
    country: "VE",
    timezone: "America/Caracas",
  },
  {
    name: "Mariara",
    country: "VE",
    timezone: "America/Caracas",
  },
  {
    name: "Ô Môn",
    country: "VN",
    timezone: "Asia/Ho_Chi_Minh",
  },
  {
    name: "Mỹ Tho",
    country: "VN",
    timezone: "Asia/Ho_Chi_Minh",
  },
  {
    name: "Buôn Hồ",
    country: "VN",
    timezone: "Asia/Ho_Chi_Minh",
  },
  {
    name: "San Lorenzo",
    country: "PY",
    timezone: "America/Asuncion",
  },
  {
    name: "Vykhino-Zhulebino",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Chernivtsi",
    country: "UA",
    timezone: "Europe/Kyiv",
  },
  {
    name: "Athens",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Olathe",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "Lafayette",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "Charlotte",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Cincinnati",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Chattanooga",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Knoxville",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Mesquite",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "Aurora",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "Wałbrzych",
    country: "PL",
    timezone: "Europe/Warsaw",
  },
  {
    name: "Sosnowiec",
    country: "PL",
    timezone: "Europe/Warsaw",
  },
  {
    name: "Volgograd",
    country: "RU",
    timezone: "Europe/Volgograd",
  },
  {
    name: "Ulyanovsk",
    country: "RU",
    timezone: "Europe/Ulyanovsk",
  },
  {
    name: "Manchester",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Clovis",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Downey",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Murrieta",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Oxnard",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Roseville",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Sunnyvale",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Centennial",
    country: "US",
    timezone: "America/Denver",
  },
  {
    name: "Las Cruces",
    country: "US",
    timezone: "America/Denver",
  },
  {
    name: "Kent",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Olmaliq",
    country: "UZ",
    timezone: "Asia/Tashkent",
  },
  {
    name: "Táriba",
    country: "VE",
    timezone: "America/Caracas",
  },
  {
    name: "Palo Negro",
    country: "VE",
    timezone: "America/Caracas",
  },
  {
    name: "Mérida",
    country: "VE",
    timezone: "America/Caracas",
  },
  {
    name: "El Limón",
    country: "VE",
    timezone: "America/Caracas",
  },
  {
    name: "Vĩnh Long",
    country: "VN",
    timezone: "Asia/Ho_Chi_Minh",
  },
  {
    name: "Việt Trì",
    country: "VN",
    timezone: "Asia/Bangkok",
  },
  {
    name: "Perm",
    country: "RU",
    timezone: "Asia/Yekaterinburg",
  },
  {
    name: "Novo-Peredelkino",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Nalchik",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Kovrov",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Ivanovo",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Kurgan",
    country: "RU",
    timezone: "Asia/Yekaterinburg",
  },
  {
    name: "Petropavlovsk-Kamchatsky",
    country: "RU",
    timezone: "Asia/Kamchatka",
  },
  {
    name: "Jeddah",
    country: "SA",
    timezone: "Asia/Riyadh",
  },
  {
    name: "Singapore",
    country: "SG",
    timezone: "Asia/Singapore",
  },
  {
    name: "Saint-Louis",
    country: "SN",
    timezone: "Africa/Dakar",
  },
  {
    name: "Phasi Charoen",
    country: "TH",
    timezone: "Asia/Bangkok",
  },
  {
    name: "Chon Buri",
    country: "TH",
    timezone: "Asia/Bangkok",
  },
  {
    name: "Dili",
    country: "TL",
    timezone: "Asia/Dili",
  },
  {
    name: "Kairouan",
    country: "TN",
    timezone: "Africa/Tunis",
  },
  {
    name: "Pavlohrad",
    country: "UA",
    timezone: "Europe/Kyiv",
  },
  {
    name: "Odesa",
    country: "UA",
    timezone: "Europe/Kyiv",
  },
  {
    name: "Makiivka",
    country: "UA",
    timezone: "Europe/Kyiv",
  },
  {
    name: "Montgomery",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "Lexington",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Memphis",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "Fort Worth",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "Siverek",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Konya",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Elazığ",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Afyonkarahisar",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Edirne",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Çanakkale",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Hsinchu",
    country: "TW",
    timezone: "Asia/Taipei",
  },
  {
    name: "Puerto Plata",
    country: "DO",
    timezone: "America/Santo_Domingo",
  },
  {
    name: "Boumerdas",
    country: "DZ",
    timezone: "Africa/Algiers",
  },
  {
    name: "Médéa",
    country: "DZ",
    timezone: "Africa/Algiers",
  },
  {
    name: "Rosetta",
    country: "EG",
    timezone: "Africa/Cairo",
  },
  {
    name: "Asmara",
    country: "ER",
    timezone: "Africa/Asmara",
  },
  {
    name: "Gasteiz / Vitoria",
    country: "ES",
    timezone: "Europe/Madrid",
  },
  {
    name: "Salamanca",
    country: "ES",
    timezone: "Europe/Madrid",
  },
  {
    name: "Barcelona",
    country: "ES",
    timezone: "Europe/Madrid",
  },
  {
    name: "Horta-Guinardó",
    country: "ES",
    timezone: "Europe/Madrid",
  },
  {
    name: "Bnei Brak",
    country: "IL",
    timezone: "Asia/Jerusalem",
  },
  {
    name: "Virār",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Tirunelveli",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Thanjavur",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Thāne",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Shrīrāmpur",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Solāpur",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Rāj-Nāndgaon",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Puruliya",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "New Delhi",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Najafgarh",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Muzaffarnagar",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Malappuram",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Kumbakonam",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Kūkatpalli",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Karīmnagar",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Hisar",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Gosāba",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Ghazīpur",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Ferozepore",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Deoria",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Delhi",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Borivli",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Beāwar",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Bārāsat",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Bangaon",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Bahādurgarh",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Neyshābūr",
    country: "IR",
    timezone: "Asia/Tehran",
  },
  {
    name: "Kūhdasht",
    country: "IR",
    timezone: "Asia/Tehran",
  },
  {
    name: "Najafābād",
    country: "IR",
    timezone: "Asia/Tehran",
  },
  {
    name: "Villa Canales",
    country: "GT",
    timezone: "America/Guatemala",
  },
  {
    name: "Tseung Kwan O",
    country: "HK",
    timezone: "Asia/Hong_Kong",
  },
  {
    name: "Nyíregyháza",
    country: "HU",
    timezone: "Europe/Budapest",
  },
  {
    name: "Zugló",
    country: "HU",
    timezone: "Europe/Budapest",
  },
  {
    name: "Pemalang",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Klaten",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "South Tangerang",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "St Helens",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Maidstone",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Liverpool",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Bradford",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Lahti",
    country: "FI",
    timezone: "Europe/Helsinki",
  },
  {
    name: "Panzhihua",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Taibai",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Bucaramanga",
    country: "CO",
    timezone: "America/Bogota",
  },
  {
    name: "San José",
    country: "CR",
    timezone: "America/Costa_Rica",
  },
  {
    name: "Saarbrücken",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Macapá",
    country: "BR",
    timezone: "America/Belem",
  },
  {
    name: "Caxias",
    country: "BR",
    timezone: "America/Fortaleza",
  },
  {
    name: "Vitória",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Rio Claro",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Pouso Alegre",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Mogi das Cruzes",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Itabuna",
    country: "BR",
    timezone: "America/Bahia",
  },
  {
    name: "Belo Horizonte",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Barra Mansa",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Araucária",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Araçatuba",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Hrodna",
    country: "BY",
    timezone: "Europe/Minsk",
  },
  {
    name: "Sydney",
    country: "CA",
    timezone: "America/Glace_Bay",
  },
  {
    name: "Ladner",
    country: "CA",
    timezone: "America/Vancouver",
  },
  {
    name: "Mbandaka",
    country: "CD",
    timezone: "Africa/Kinshasa",
  },
  {
    name: "Divo",
    country: "CI",
    timezone: "Africa/Abidjan",
  },
  {
    name: "Kumba",
    country: "CM",
    timezone: "Africa/Douala",
  },
  {
    name: "Bertoua",
    country: "CM",
    timezone: "Africa/Douala",
  },
  {
    name: "Zhabei",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Wayaobu",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Tongzhou",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Songjiang",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Shizuishan",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Mianyang",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Liaocheng",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Anning",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Jiyuan",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Jiaozhou",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Huangzhou",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Guilin",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Chaozhou",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Taonan",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Huadian",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Hailar",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Baishan",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Tungi",
    country: "BD",
    timezone: "Asia/Dhaka",
  },
  {
    name: "Sylhet",
    country: "BD",
    timezone: "Asia/Dhaka",
  },
  {
    name: "Namur",
    country: "BE",
    timezone: "Europe/Brussels",
  },
  {
    name: "Gyumri",
    country: "AM",
    timezone: "Asia/Yerevan",
  },
  {
    name: "Santa Fe",
    country: "AR",
    timezone: "America/Argentina/Cordoba",
  },
  {
    name: "Linz",
    country: "AT",
    timezone: "Europe/Vienna",
  },
  {
    name: "Darwin",
    country: "AU",
    timezone: "Australia/Darwin",
  },
  {
    name: "Cuautitlán",
    country: "MX",
    timezone: "America/Mexico_City",
  },
  {
    name: "Ciudad López Mateos",
    country: "MX",
    timezone: "America/Mexico_City",
  },
  {
    name: "Benito Juarez",
    country: "MX",
    timezone: "America/Mexico_City",
  },
  {
    name: "Buenavista",
    country: "MX",
    timezone: "America/Mexico_City",
  },
  {
    name: "Santiago de Querétaro",
    country: "MX",
    timezone: "America/Mexico_City",
  },
  {
    name: "Irapuato",
    country: "MX",
    timezone: "America/Mexico_City",
  },
  {
    name: "Kulim",
    country: "MY",
    timezone: "Asia/Kuala_Lumpur",
  },
  {
    name: "Windhoek",
    country: "NA",
    timezone: "Africa/Windhoek",
  },
  {
    name: "Niamey",
    country: "NE",
    timezone: "Africa/Niamey",
  },
  {
    name: "Sokoto",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Atani",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Abuja",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Aba",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Poznań",
    country: "PL",
    timezone: "Europe/Warsaw",
  },
  {
    name: "Legnica",
    country: "PL",
    timezone: "Europe/Warsaw",
  },
  {
    name: "Bydgoszcz",
    country: "PL",
    timezone: "Europe/Warsaw",
  },
  {
    name: "Amadora",
    country: "PT",
    timezone: "Europe/Lisbon",
  },
  {
    name: "Ciudad del Este",
    country: "PY",
    timezone: "America/Asuncion",
  },
  {
    name: "Sibiu",
    country: "RO",
    timezone: "Europe/Bucharest",
  },
  {
    name: "Râmnicu Vâlcea",
    country: "RO",
    timezone: "Europe/Bucharest",
  },
  {
    name: "Arad",
    country: "RO",
    timezone: "Europe/Bucharest",
  },
  {
    name: "Čačak",
    country: "RS",
    timezone: "Europe/Belgrade",
  },
  {
    name: "Eindhoven",
    country: "NL",
    timezone: "Europe/Amsterdam",
  },
  {
    name: "San Juan",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Marawi City",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Makati City",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Baguio",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Ube",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Sasebo",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Saga",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Niigata",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Hadano",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Shimotoda",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Hirosaki",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Akishima",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Andong",
    country: "KR",
    timezone: "Asia/Seoul",
  },
  {
    name: "Ḩawallī",
    country: "KW",
    timezone: "Asia/Kuwait",
  },
  {
    name: "Zhezqazghan",
    country: "KZ",
    timezone: "Asia/Almaty",
  },
  {
    name: "Rudnyy",
    country: "KZ",
    timezone: "Asia/Qostanay",
  },
  {
    name: "Larkana",
    country: "PK",
    timezone: "Asia/Karachi",
  },
  {
    name: "Jacobabad",
    country: "PK",
    timezone: "Asia/Karachi",
  },
  {
    name: "Marrakesh",
    country: "MA",
    timezone: "Africa/Casablanca",
  },
  {
    name: "Sikasso",
    country: "ML",
    timezone: "Africa/Bamako",
  },
  {
    name: "Florence",
    country: "IT",
    timezone: "Europe/Rome",
  },
  {
    name: "Vereeniging",
    country: "ZA",
    timezone: "Africa/Johannesburg",
  },
  {
    name: "Kimberley",
    country: "ZA",
    timezone: "Africa/Johannesburg",
  },
  {
    name: "Tampico",
    country: "MX",
    timezone: "America/Monterrey",
  },
  {
    name: "Tuxtepec",
    country: "MX",
    timezone: "America/Mexico_City",
  },
  {
    name: "Mérida",
    country: "MX",
    timezone: "America/Merida",
  },
  {
    name: "Chetumal",
    country: "MX",
    timezone: "America/Cancun",
  },
  {
    name: "Monterrey",
    country: "MX",
    timezone: "America/Monterrey",
  },
  {
    name: "Skudai",
    country: "MY",
    timezone: "Asia/Kuala_Lumpur",
  },
  {
    name: "Kuala Terengganu",
    country: "MY",
    timezone: "Asia/Kuala_Lumpur",
  },
  {
    name: "Gashua",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Tsuyama",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Tsuruoka",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Oyama",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Ōta",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Okazaki",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Okayama",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Nagareyama",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Kokubunji",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Kishiwada",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Kiryū",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Hirakata",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Nakano",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Hyesan",
    country: "KP",
    timezone: "Asia/Pyongyang",
  },
  {
    name: "Chongjin",
    country: "KP",
    timezone: "Asia/Pyongyang",
  },
  {
    name: "Daejeon",
    country: "KR",
    timezone: "Asia/Seoul",
  },
  {
    name: "Kandy",
    country: "LK",
    timezone: "Asia/Colombo",
  },
  {
    name: "Antsirabe",
    country: "MG",
    timezone: "Indian/Antananarivo",
  },
  {
    name: "Ambovombe",
    country: "MG",
    timezone: "Indian/Antananarivo",
  },
  {
    name: "Taungoo",
    country: "MM",
    timezone: "Asia/Yangon",
  },
  {
    name: "Myingyan",
    country: "MM",
    timezone: "Asia/Yangon",
  },
  {
    name: "Pyin Oo Lwin",
    country: "MM",
    timezone: "Asia/Yangon",
  },
  {
    name: "Taytay",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Digos",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Dasmariñas",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Pakpattan",
    country: "PK",
    timezone: "Asia/Karachi",
  },
  {
    name: "Kohat",
    country: "PK",
    timezone: "Asia/Karachi",
  },
  {
    name: "Battagram",
    country: "PK",
    timezone: "Asia/Karachi",
  },
  {
    name: "Omaha",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "Paterson",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Gravesend",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Jamaica",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Tempe Junction",
    country: "US",
    timezone: "America/Phoenix",
  },
  {
    name: "Rialto",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Santa Ana",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Las Vegas",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Reno",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Namangan",
    country: "UZ",
    timezone: "Asia/Tashkent",
  },
  {
    name: "Punto Fijo",
    country: "VE",
    timezone: "America/Caracas",
  },
  {
    name: "Los Teques",
    country: "VE",
    timezone: "America/Caracas",
  },
  {
    name: "Carora",
    country: "VE",
    timezone: "America/Caracas",
  },
  {
    name: "Vinh",
    country: "VN",
    timezone: "Asia/Bangkok",
  },
  {
    name: "Nam Định",
    country: "VN",
    timezone: "Asia/Bangkok",
  },
  {
    name: "Ðà Lạt",
    country: "VN",
    timezone: "Asia/Ho_Chi_Minh",
  },
  {
    name: "Huyện Lâm Hà",
    country: "VN",
    timezone: "Asia/Ho_Chi_Minh",
  },
  {
    name: "Ndola",
    country: "ZM",
    timezone: "Africa/Lusaka",
  },
  {
    name: "Kalisz",
    country: "PL",
    timezone: "Europe/Warsaw",
  },
  {
    name: "Hebron",
    country: "PS",
    timezone: "Asia/Hebron",
  },
  {
    name: "Voronezh",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Orekhovo-Zuyevo",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Orekhovo-Borisovo Severnoye",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Murmansk",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Brateyevo",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Bibirevo",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Vladivostok",
    country: "RU",
    timezone: "Asia/Vladivostok",
  },
  {
    name: "Artëm",
    country: "RU",
    timezone: "Asia/Vladivostok",
  },
  {
    name: "Port Sudan",
    country: "SD",
    timezone: "Africa/Khartoum",
  },
  {
    name: "Tiébo",
    country: "SN",
    timezone: "Africa/Dakar",
  },
  {
    name: "Samut Prakan",
    country: "TH",
    timezone: "Asia/Bangkok",
  },
  {
    name: "Kŭlob",
    country: "TJ",
    timezone: "Asia/Dushanbe",
  },
  {
    name: "Pompano Beach",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Ironville",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "East Independence",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "Jackson",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "Clarksville",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "Frisco",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "McKinney",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "Stamford",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Viranşehir",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Kahramanmaraş",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Adana",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Taipei",
    country: "TW",
    timezone: "Asia/Taipei",
  },
  {
    name: "Radom",
    country: "PL",
    timezone: "Europe/Warsaw",
  },
  {
    name: "Białołeka",
    country: "PL",
    timezone: "Europe/Warsaw",
  },
  {
    name: "Poltava",
    country: "UA",
    timezone: "Europe/Kyiv",
  },
  {
    name: "Moshi",
    country: "TZ",
    timezone: "Africa/Dar_es_Salaam",
  },
  {
    name: "Strogino",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Paulista",
    country: "BR",
    timezone: "America/Recife",
  },
  {
    name: "Várzea Paulista",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Varginha",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Ribeirão das Neves",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Marília",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Ipatinga",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Embu",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Catanduva",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Pinsk",
    country: "BY",
    timezone: "Europe/Minsk",
  },
  {
    name: "Ajax",
    country: "CA",
    timezone: "America/Toronto",
  },
  {
    name: "Hamilton",
    country: "CA",
    timezone: "America/Toronto",
  },
  {
    name: "Richmond",
    country: "CA",
    timezone: "America/Vancouver",
  },
  {
    name: "Saguenay",
    country: "CA",
    timezone: "America/Toronto",
  },
  {
    name: "Victoria",
    country: "CA",
    timezone: "America/Vancouver",
  },
  {
    name: "Windsor",
    country: "CA",
    timezone: "America/Toronto",
  },
  {
    name: "Yaoundé",
    country: "CM",
    timezone: "Africa/Douala",
  },
  {
    name: "Mbouda",
    country: "CM",
    timezone: "Africa/Douala",
  },
  {
    name: "Bafoussam",
    country: "CM",
    timezone: "Africa/Douala",
  },
  {
    name: "Zhucheng",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Zhangzhou",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Pizhou",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Yangquan",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Tongshan",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Wansheng",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Huangshan",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Tongchuanshi",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Sanya",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Qingyuan",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Hepu",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Laiyang",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Ji’an",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Hanjia",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Haikou",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Foshan",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Fengcheng",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Chaohu",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Beihai",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Zhaodong",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Dehui",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Sharjah",
    country: "AE",
    timezone: "Asia/Dubai",
  },
  {
    name: "Al Ain City",
    country: "AE",
    timezone: "Asia/Dubai",
  },
  {
    name: "Merlo",
    country: "AR",
    timezone: "America/Argentina/Buenos_Aires",
  },
  {
    name: "Santiago del Estero",
    country: "AR",
    timezone: "America/Argentina/Cordoba",
  },
  {
    name: "San Salvador de Jujuy",
    country: "AR",
    timezone: "America/Argentina/Jujuy",
  },
  {
    name: "Río Cuarto",
    country: "AR",
    timezone: "America/Argentina/Cordoba",
  },
  {
    name: "Perth",
    country: "AU",
    timezone: "Australia/Perth",
  },
  {
    name: "Mesa",
    country: "US",
    timezone: "America/Phoenix",
  },
  {
    name: "Salinas",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "San Diego",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Santa Clarita",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Henderson",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Amarillo",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "Anchorage",
    country: "US",
    timezone: "America/Anchorage",
  },
  {
    name: "Los Rastrojos",
    country: "VE",
    timezone: "America/Caracas",
  },
  {
    name: "Guatire",
    country: "VE",
    timezone: "America/Caracas",
  },
  {
    name: "Bến Tre",
    country: "VN",
    timezone: "Asia/Ho_Chi_Minh",
  },
  {
    name: "Sinŭiju",
    country: "KP",
    timezone: "Asia/Pyongyang",
  },
  {
    name: "Suwon",
    country: "KR",
    timezone: "Asia/Seoul",
  },
  {
    name: "Gunpo",
    country: "KR",
    timezone: "Asia/Seoul",
  },
  {
    name: "Incheon",
    country: "KR",
    timezone: "Asia/Seoul",
  },
  {
    name: "Hwaseong-si",
    country: "KR",
    timezone: "Asia/Seoul",
  },
  {
    name: "Changwon",
    country: "KR",
    timezone: "Asia/Seoul",
  },
  {
    name: "Maharagama",
    country: "LK",
    timezone: "Asia/Colombo",
  },
  {
    name: "Khouribga",
    country: "MA",
    timezone: "Africa/Casablanca",
  },
  {
    name: "Bamako",
    country: "ML",
    timezone: "Africa/Bamako",
  },
  {
    name: "Georgetown",
    country: "GY",
    timezone: "America/Guyana",
  },
  {
    name: "Tsuen Wan",
    country: "HK",
    timezone: "Asia/Hong_Kong",
  },
  {
    name: "Palembang",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Bukittinggi",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Saint Peters",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Gloucester",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Blackburn",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Rustavi",
    country: "GE",
    timezone: "Asia/Tbilisi",
  },
  {
    name: "Kumasi",
    country: "GH",
    timezone: "Africa/Accra",
  },
  {
    name: "Vladimir",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Musoma",
    country: "TZ",
    timezone: "Africa/Dar_es_Salaam",
  },
  {
    name: "Amsterdam",
    country: "NL",
    timezone: "Europe/Amsterdam",
  },
  {
    name: "Iquitos",
    country: "PE",
    timezone: "America/Lima",
  },
  {
    name: "Huaraz",
    country: "PE",
    timezone: "America/Lima",
  },
  {
    name: "San Martin",
    country: "PE",
    timezone: "America/Lima",
  },
  {
    name: "Manila",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Calamba",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Bago City",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Lahore",
    country: "PK",
    timezone: "Asia/Karachi",
  },
  {
    name: "Dera Ismail Khan",
    country: "PK",
    timezone: "Asia/Karachi",
  },
  {
    name: "Dera Ghazi Khan",
    country: "PK",
    timezone: "Asia/Karachi",
  },
  {
    name: "Daska Kalan",
    country: "PK",
    timezone: "Asia/Karachi",
  },
  {
    name: "Severodvinsk",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Presnenskiy",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Tobolsk",
    country: "RU",
    timezone: "Asia/Yekaterinburg",
  },
  {
    name: "Novokuznetsk",
    country: "RU",
    timezone: "Asia/Novokuznetsk",
  },
  {
    name: "Angarsk",
    country: "RU",
    timezone: "Asia/Irkutsk",
  },
  {
    name: "Orekhovo-Borisovo",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Medina",
    country: "SA",
    timezone: "Asia/Riyadh",
  },
  {
    name: "El Fasher",
    country: "SD",
    timezone: "Africa/Khartoum",
  },
  {
    name: "Marka",
    country: "SO",
    timezone: "Africa/Mogadishu",
  },
  {
    name: "Nakhon Si Thammarat",
    country: "TH",
    timezone: "Asia/Bangkok",
  },
  {
    name: "İzmir",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Balıkesir",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Ruda Śląska",
    country: "PL",
    timezone: "Europe/Warsaw",
  },
  {
    name: "Porto",
    country: "PT",
    timezone: "Europe/Lisbon",
  },
  {
    name: "Zheleznodorozhnyy",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Quillacollo",
    country: "BO",
    timezone: "America/La_Paz",
  },
  {
    name: "Parnamirim",
    country: "BR",
    timezone: "America/Fortaleza",
  },
  {
    name: "Marabá",
    country: "BR",
    timezone: "America/Belem",
  },
  {
    name: "Salvador",
    country: "BR",
    timezone: "America/Bahia",
  },
  {
    name: "Rondonópolis",
    country: "BR",
    timezone: "America/Cuiaba",
  },
  {
    name: "Rio Verde",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Macaé",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Jaú",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Dourados",
    country: "BR",
    timezone: "America/Campo_Grande",
  },
  {
    name: "Campo Grande",
    country: "BR",
    timezone: "America/Campo_Grande",
  },
  {
    name: "Blumenau",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Porto Velho",
    country: "BR",
    timezone: "America/Porto_Velho",
  },
  {
    name: "Sinop",
    country: "BR",
    timezone: "America/Cuiaba",
  },
  {
    name: "Vitebsk",
    country: "BY",
    timezone: "Europe/Minsk",
  },
  {
    name: "Brest",
    country: "BY",
    timezone: "Europe/Minsk",
  },
  {
    name: "Kingston",
    country: "CA",
    timezone: "America/Toronto",
  },
  {
    name: "Terrebonne",
    country: "CA",
    timezone: "America/Toronto",
  },
  {
    name: "Tshikapa",
    country: "CD",
    timezone: "Africa/Lubumbashi",
  },
  {
    name: "Likasi",
    country: "CD",
    timezone: "Africa/Lubumbashi",
  },
  {
    name: "Kolwezi",
    country: "CD",
    timezone: "Africa/Lubumbashi",
  },
  {
    name: "Masina",
    country: "CD",
    timezone: "Africa/Kinshasa",
  },
  {
    name: "Lausanne",
    country: "CH",
    timezone: "Europe/Zurich",
  },
  {
    name: "Bern",
    country: "CH",
    timezone: "Europe/Zurich",
  },
  {
    name: "Nanjin",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Liuzhi",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Soledad",
    country: "CO",
    timezone: "America/Bogota",
  },
  {
    name: "Quibdó",
    country: "CO",
    timezone: "America/Bogota",
  },
  {
    name: "Pitalito",
    country: "CO",
    timezone: "America/Bogota",
  },
  {
    name: "Guadalajara de Buga",
    country: "CO",
    timezone: "America/Bogota",
  },
  {
    name: "Wolfsburg",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Siegen",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Braunschweig",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Rodenkirchen",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Salvaleón de Higüey",
    country: "DO",
    timezone: "America/Santo_Domingo",
  },
  {
    name: "La Romana",
    country: "DO",
    timezone: "America/Santo_Domingo",
  },
  {
    name: "Djelfa",
    country: "DZ",
    timezone: "Africa/Algiers",
  },
  {
    name: "Baraki",
    country: "DZ",
    timezone: "Africa/Algiers",
  },
  {
    name: "Ibarra",
    country: "EC",
    timezone: "America/Guayaquil",
  },
  {
    name: "Ţahţā",
    country: "EG",
    timezone: "Africa/Cairo",
  },
  {
    name: "Al ‘Āshir min Ramaḑān",
    country: "EG",
    timezone: "Africa/Cairo",
  },
  {
    name: "Damietta",
    country: "EG",
    timezone: "Africa/Cairo",
  },
  {
    name: "Suez",
    country: "EG",
    timezone: "Africa/Cairo",
  },
  {
    name: "Al Maţarīyah",
    country: "EG",
    timezone: "Africa/Cairo",
  },
  {
    name: "Giza",
    country: "EG",
    timezone: "Africa/Cairo",
  },
  {
    name: "Jerez de la Frontera",
    country: "ES",
    timezone: "Europe/Madrid",
  },
  {
    name: "Cartagena",
    country: "ES",
    timezone: "Europe/Madrid",
  },
  {
    name: "Villaverde",
    country: "ES",
    timezone: "Europe/Madrid",
  },
  {
    name: "Santander",
    country: "ES",
    timezone: "Europe/Madrid",
  },
  {
    name: "Hortaleza",
    country: "ES",
    timezone: "Europe/Madrid",
  },
  {
    name: "Chamberí",
    country: "ES",
    timezone: "Europe/Madrid",
  },
  {
    name: "Retiro",
    country: "ES",
    timezone: "Europe/Madrid",
  },
  {
    name: "Marseille",
    country: "FR",
    timezone: "Europe/Paris",
  },
  {
    name: "Lyon",
    country: "FR",
    timezone: "Europe/Paris",
  },
  {
    name: "Boulogne-Billancourt",
    country: "FR",
    timezone: "Europe/Paris",
  },
  {
    name: "Bondoukou",
    country: "CI",
    timezone: "Africa/Abidjan",
  },
  {
    name: "San Bernardo",
    country: "CL",
    timezone: "America/Santiago",
  },
  {
    name: "Mengmao",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Karamay",
    country: "CN",
    timezone: "Asia/Urumqi",
  },
  {
    name: "Zhenjiang",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Zhaotong",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Yantai",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Xuyong",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Weifang",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Tianjin",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Suzhou",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Suicheng",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Shiqiao",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Shaoxing",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Loudi",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Jincheng",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Humen",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Hangzhou",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Gangu Chengguanzhen",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Anbu",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Sujiatun",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Mudanjiang",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Datong",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Anshan",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Sherpur",
    country: "BD",
    timezone: "Asia/Dhaka",
  },
  {
    name: "Baghlān",
    country: "AF",
    timezone: "Asia/Kabul",
  },
  {
    name: "San Nicolás de los Arroyos",
    country: "AR",
    timezone: "America/Argentina/Buenos_Aires",
  },
  {
    name: "Mackay",
    country: "AU",
    timezone: "Australia/Brisbane",
  },
  {
    name: "Reutlingen",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Gera",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Gustavo Adolfo Madero",
    country: "MX",
    timezone: "America/Mexico_City",
  },
  {
    name: "Orizaba",
    country: "MX",
    timezone: "America/Mexico_City",
  },
  {
    name: "Acapulco de Juárez",
    country: "MX",
    timezone: "America/Mexico_City",
  },
  {
    name: "Huixquilucan",
    country: "MX",
    timezone: "America/Mexico_City",
  },
  {
    name: "Torreón",
    country: "MX",
    timezone: "America/Monterrey",
  },
  {
    name: "San Nicolás de los Garza",
    country: "MX",
    timezone: "America/Monterrey",
  },
  {
    name: "Salamanca",
    country: "MX",
    timezone: "America/Mexico_City",
  },
  {
    name: "Bintulu",
    country: "MY",
    timezone: "Asia/Kuching",
  },
  {
    name: "Beira",
    country: "MZ",
    timezone: "Africa/Maputo",
  },
  {
    name: "Katsina",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Gusau",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Bida",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Awka",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Amaigbo",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Vasco da Gama",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Udupi",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Rewāri",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Mandya",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Mālegaon",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Jetpur",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Jālna",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Dehra Dūn",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Bhubaneswar",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Al Ḩillah",
    country: "IQ",
    timezone: "Asia/Baghdad",
  },
  {
    name: "Ahvaz",
    country: "IR",
    timezone: "Asia/Tehran",
  },
  {
    name: "Siracusa",
    country: "IT",
    timezone: "Europe/Rome",
  },
  {
    name: "Novara",
    country: "IT",
    timezone: "Europe/Rome",
  },
  {
    name: "Bila Tserkva",
    country: "UA",
    timezone: "Europe/Kyiv",
  },
  {
    name: "Atlanta",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Cary",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Virginia Beach",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Tottori",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Tondabayashichō",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Takaoka",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Sōka",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Sano",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Ōme",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Nagasaki",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Nagaoka",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Kawanishi",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Izumo",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Handa",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Fujinomiya",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Chikushino-shi",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Matsuyama",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Habikino",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Mitrovicë",
    country: "XK",
    timezone: "Europe/Belgrade",
  },
  {
    name: "Ibb",
    country: "YE",
    timezone: "Asia/Aden",
  },
  {
    name: "Mufulira",
    country: "ZM",
    timezone: "Africa/Lusaka",
  },
  {
    name: "Kadoma",
    country: "ZW",
    timezone: "Africa/Harare",
  },
  {
    name: "Rouen",
    country: "FR",
    timezone: "Europe/Paris",
  },
  {
    name: "Rennes",
    country: "FR",
    timezone: "Europe/Paris",
  },
  {
    name: "Nîmes",
    country: "FR",
    timezone: "Europe/Paris",
  },
  {
    name: "Nice",
    country: "FR",
    timezone: "Europe/Paris",
  },
  {
    name: "Saint-Quentin-en-Yvelines",
    country: "FR",
    timezone: "Europe/Paris",
  },
  {
    name: "San Pedro de Macorís",
    country: "DO",
    timezone: "America/Santo_Domingo",
  },
  {
    name: "Santo Domingo Oeste",
    country: "DO",
    timezone: "America/Santo_Domingo",
  },
  {
    name: "Skikda",
    country: "DZ",
    timezone: "Africa/Algiers",
  },
  {
    name: "Chlef",
    country: "DZ",
    timezone: "Africa/Algiers",
  },
  {
    name: "Milagro",
    country: "EC",
    timezone: "America/Guayaquil",
  },
  {
    name: "Munūf",
    country: "EG",
    timezone: "Africa/Cairo",
  },
  {
    name: "Kafr ad Dawwār",
    country: "EG",
    timezone: "Africa/Cairo",
  },
  {
    name: "Idkū",
    country: "EG",
    timezone: "Africa/Cairo",
  },
  {
    name: "Banhā",
    country: "EG",
    timezone: "Africa/Cairo",
  },
  {
    name: "Akhmīm",
    country: "EG",
    timezone: "Africa/Cairo",
  },
  {
    name: "Málaga",
    country: "ES",
    timezone: "Europe/Madrid",
  },
  {
    name: "Valladolid",
    country: "ES",
    timezone: "Europe/Madrid",
  },
  {
    name: "Burgos",
    country: "ES",
    timezone: "Europe/Madrid",
  },
  {
    name: "Harar",
    country: "ET",
    timezone: "Africa/Addis_Ababa",
  },
  {
    name: "Debre Birhan",
    country: "ET",
    timezone: "Africa/Addis_Ababa",
  },
  {
    name: "Vantaa",
    country: "FI",
    timezone: "Europe/Helsinki",
  },
  {
    name: "Changji",
    country: "CN",
    timezone: "Asia/Urumqi",
  },
  {
    name: "Yuncheng",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Chengzhong",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Tangshan",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Simao",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Puqi",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Neijiang",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Linfen",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Gaomi",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Yiwu",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Qiqihar",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Jiaohe",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Baotou",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Sumqayıt",
    country: "AZ",
    timezone: "Asia/Baku",
  },
  {
    name: "Jamālpur",
    country: "BD",
    timezone: "Asia/Dhaka",
  },
  {
    name: "Pécs",
    country: "HU",
    timezone: "Europe/Budapest",
  },
  {
    name: "Bandung",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Oxford",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Doncaster",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Blackpool",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "N’dalatando",
    country: "AO",
    timezone: "Africa/Luanda",
  },
  {
    name: "Luanda",
    country: "AO",
    timezone: "Africa/Luanda",
  },
  {
    name: "Mendoza",
    country: "AR",
    timezone: "America/Argentina/Mendoza",
  },
  {
    name: "Simmering",
    country: "AT",
    timezone: "Europe/Vienna",
  },
  {
    name: "Eimsbüttel",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Sergiyev Posad",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Lyublino",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Lipetsk",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Kuz’minki",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Glazov",
    country: "RU",
    timezone: "Europe/Samara",
  },
  {
    name: "Biryulëvo",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Ussuriysk",
    country: "RU",
    timezone: "Asia/Vladivostok",
  },
  {
    name: "Sakakah",
    country: "SA",
    timezone: "Asia/Riyadh",
  },
  {
    name: "Az Zulfī",
    country: "SA",
    timezone: "Asia/Riyadh",
  },
  {
    name: "Al Jubayl",
    country: "SA",
    timezone: "Asia/Riyadh",
  },
  {
    name: "Singa",
    country: "SD",
    timezone: "Africa/Khartoum",
  },
  {
    name: "Södermalm",
    country: "SE",
    timezone: "Europe/Stockholm",
  },
  {
    name: "Geylang",
    country: "SG",
    timezone: "Asia/Singapore",
  },
  {
    name: "Yei",
    country: "SS",
    timezone: "Africa/Juba",
  },
  {
    name: "Istaravshan",
    country: "TJ",
    timezone: "Asia/Dushanbe",
  },
  {
    name: "Istanbul",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Adapazarı",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Beylikdüzü",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Taichung",
    country: "TW",
    timezone: "Asia/Taipei",
  },
  {
    name: "Rzeszów",
    country: "PL",
    timezone: "Europe/Warsaw",
  },
  {
    name: "Zabrze",
    country: "PL",
    timezone: "Europe/Warsaw",
  },
  {
    name: "Ursynów",
    country: "PL",
    timezone: "Europe/Warsaw",
  },
  {
    name: "Doha",
    country: "QA",
    timezone: "Asia/Qatar",
  },
  {
    name: "Saint-Denis",
    country: "RE",
    timezone: "Indian/Reunion",
  },
  {
    name: "Sector 4",
    country: "RO",
    timezone: "Europe/Bucharest",
  },
  {
    name: "Kragujevac",
    country: "RS",
    timezone: "Europe/Belgrade",
  },
  {
    name: "Zyablikovo",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Toluca",
    country: "MX",
    timezone: "America/Mexico_City",
  },
  {
    name: "Ciudad Nezahualcoyotl",
    country: "MX",
    timezone: "America/Mexico_City",
  },
  {
    name: "Mexicali",
    country: "MX",
    timezone: "America/Tijuana",
  },
  {
    name: "Ciudad Juárez",
    country: "MX",
    timezone: "America/Ciudad_Juarez",
  },
  {
    name: "Kampung Baru Subang",
    country: "MY",
    timezone: "Asia/Kuala_Lumpur",
  },
  {
    name: "Subang Jaya",
    country: "MY",
    timezone: "Asia/Kuala_Lumpur",
  },
  {
    name: "Maputo",
    country: "MZ",
    timezone: "Africa/Maputo",
  },
  {
    name: "Nguru",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Kisi",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Wādī as Sīr",
    country: "JO",
    timezone: "Asia/Amman",
  },
  {
    name: "As Salţ",
    country: "JO",
    timezone: "Asia/Amman",
  },
  {
    name: "Utsunomiya",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Toyota",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Tokorozawa",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Tajimi",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Mino",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Kusatsu",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Kumamoto",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Kawagoe",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Fujisawa",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Yamagata",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Katsuta",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Ishinomaki",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Kitami",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Takeo",
    country: "KH",
    timezone: "Asia/Phnom_Penh",
  },
  {
    name: "Sariwŏn",
    country: "KP",
    timezone: "Asia/Pyongyang",
  },
  {
    name: "Daegu",
    country: "KR",
    timezone: "Asia/Seoul",
  },
  {
    name: "Gimcheon",
    country: "KR",
    timezone: "Asia/Seoul",
  },
  {
    name: "Iksan",
    country: "KR",
    timezone: "Asia/Seoul",
  },
  {
    name: "Donghae City",
    country: "KR",
    timezone: "Asia/Seoul",
  },
  {
    name: "Zhanaozen",
    country: "KZ",
    timezone: "Asia/Aqtau",
  },
  {
    name: "Temirtau",
    country: "KZ",
    timezone: "Asia/Almaty",
  },
  {
    name: "Vilnius",
    country: "LT",
    timezone: "Europe/Vilnius",
  },
  {
    name: "Oujda-Angad",
    country: "MA",
    timezone: "Africa/Casablanca",
  },
  {
    name: "Skopje",
    country: "MK",
    timezone: "Europe/Skopje",
  },
  {
    name: "Zhu Cheng City",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Xuzhou",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Chongzuo",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Maicao",
    country: "CO",
    timezone: "America/Bogota",
  },
  {
    name: "Dosquebradas",
    country: "CO",
    timezone: "America/Bogota",
  },
  {
    name: "Cúcuta",
    country: "CO",
    timezone: "America/Bogota",
  },
  {
    name: "Boyeros",
    country: "CU",
    timezone: "America/Havana",
  },
  {
    name: "Ouahigouya",
    country: "BF",
    timezone: "Africa/Ouagadougou",
  },
  {
    name: "Kaya",
    country: "BF",
    timezone: "Africa/Ouagadougou",
  },
  {
    name: "Cabo",
    country: "BR",
    timezone: "America/Recife",
  },
  {
    name: "Arapiraca",
    country: "BR",
    timezone: "America/Maceio",
  },
  {
    name: "Tatuí",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Serra",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "São José dos Pinhais",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Luziânia",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Linhares",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Canoas",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Assis",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Aparecida de Goiânia",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Simões Filho",
    country: "BR",
    timezone: "America/Bahia",
  },
  {
    name: "Alvorada",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Vancouver",
    country: "CA",
    timezone: "America/Vancouver",
  },
  {
    name: "Isiro",
    country: "CD",
    timezone: "Africa/Lubumbashi",
  },
  {
    name: "Bukavu",
    country: "CD",
    timezone: "Africa/Lubumbashi",
  },
  {
    name: "Kinshasa",
    country: "CD",
    timezone: "Africa/Kinshasa",
  },
  {
    name: "Yamoussoukro",
    country: "CI",
    timezone: "Africa/Abidjan",
  },
  {
    name: "Viña del Mar",
    country: "CL",
    timezone: "America/Santiago",
  },
  {
    name: "Sivakasi",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Satna",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Sambalpur",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Roorkee",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Ranchi",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Rāiganj",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Raebareli",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Porbandar",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Nizāmābād",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Navadwīp",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Mau",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Kishangarh",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Khanna",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Karnāl",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Jalandhar",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Itārsi",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Hyderābād",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Gondal",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Bhayandar",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Bareilly",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Baidyabāti",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Baharampur",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Āvadi",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Ādoni",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Phusro",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Amaravati",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Chirmiri",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Iranshahr",
    country: "IR",
    timezone: "Asia/Tehran",
  },
  {
    name: "Verona",
    country: "IT",
    timezone: "Europe/Rome",
  },
  {
    name: "Modena",
    country: "IT",
    timezone: "Europe/Rome",
  },
  {
    name: "Tilburg",
    country: "NL",
    timezone: "Europe/Amsterdam",
  },
  {
    name: "Arnhem",
    country: "NL",
    timezone: "Europe/Amsterdam",
  },
  {
    name: "Piura",
    country: "PE",
    timezone: "America/Lima",
  },
  {
    name: "Huancayo",
    country: "PE",
    timezone: "America/Lima",
  },
  {
    name: "Callao",
    country: "PE",
    timezone: "America/Lima",
  },
  {
    name: "Santa Anita - Los Ficus",
    country: "PE",
    timezone: "America/Lima",
  },
  {
    name: "Port Moresby",
    country: "PG",
    timezone: "Pacific/Port_Moresby",
  },
  {
    name: "Silang",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Cebu City",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Bahawalnagar",
    country: "PK",
    timezone: "Asia/Karachi",
  },
  {
    name: "Uman",
    country: "UA",
    timezone: "Europe/Kyiv",
  },
  {
    name: "Donetsk",
    country: "UA",
    timezone: "Europe/Kyiv",
  },
  {
    name: "Columbus",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Springfield",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "St. Louis",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "Wilmington",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Pearland",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "Richardson",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "Sterling Heights",
    country: "US",
    timezone: "America/Detroit",
  },
  {
    name: "Brooklyn",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Berkeley",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Sacramento",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Van Nuys",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Boise",
    country: "US",
    timezone: "America/Boise",
  },
  {
    name: "West Valley City",
    country: "US",
    timezone: "America/Denver",
  },
  {
    name: "Tashkent",
    country: "UZ",
    timezone: "Asia/Tashkent",
  },
  {
    name: "Alto Barinas",
    country: "VE",
    timezone: "America/Caracas",
  },
  {
    name: "Puerto La Cruz",
    country: "VE",
    timezone: "America/Caracas",
  },
  {
    name: "Cagua",
    country: "VE",
    timezone: "America/Caracas",
  },
  {
    name: "Maturín",
    country: "VE",
    timezone: "America/Caracas",
  },
  {
    name: "Hanoi",
    country: "VN",
    timezone: "Asia/Bangkok",
  },
  {
    name: "Prizren",
    country: "XK",
    timezone: "Europe/Belgrade",
  },
  {
    name: "Boksburg",
    country: "ZA",
    timezone: "Africa/Johannesburg",
  },
  {
    name: "Orléans",
    country: "FR",
    timezone: "Europe/Paris",
  },
  {
    name: "Punta Cana",
    country: "DO",
    timezone: "America/Santo_Domingo",
  },
  {
    name: "Manta",
    country: "EC",
    timezone: "America/Guayaquil",
  },
  {
    name: "Esmeraldas",
    country: "EC",
    timezone: "America/Guayaquil",
  },
  {
    name: "Qalyūb",
    country: "EG",
    timezone: "Africa/Cairo",
  },
  {
    name: "Al Manşūrah",
    country: "EG",
    timezone: "Africa/Cairo",
  },
  {
    name: "Sevilla",
    country: "ES",
    timezone: "Europe/Madrid",
  },
  {
    name: "Cadiz",
    country: "ES",
    timezone: "Europe/Madrid",
  },
  {
    name: "Pamplona",
    country: "ES",
    timezone: "Europe/Madrid",
  },
  {
    name: "Mataró",
    country: "ES",
    timezone: "Europe/Madrid",
  },
  {
    name: "Madrid",
    country: "ES",
    timezone: "Europe/Madrid",
  },
  {
    name: "Chamartín",
    country: "ES",
    timezone: "Europe/Madrid",
  },
  {
    name: "Sarrià-Sant Gervasi",
    country: "ES",
    timezone: "Europe/Madrid",
  },
  {
    name: "Tel Aviv",
    country: "IL",
    timezone: "Asia/Jerusalem",
  },
  {
    name: "Rishon LeTsiyyon",
    country: "IL",
    timezone: "Asia/Jerusalem",
  },
  {
    name: "Yelahanka",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Ujjain",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Rājkot",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Pune",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Port Blair",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Pānihāti",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Nandyāl",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Nadiād",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Ludhiāna",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Lalitpur",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Jamshedpur",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Chāpra",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Bhiwandi",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Erbil",
    country: "IQ",
    timezone: "Asia/Baghdad",
  },
  {
    name: "Genoa",
    country: "IT",
    timezone: "Europe/Rome",
  },
  {
    name: "Singaraja",
    country: "ID",
    timezone: "Asia/Makassar",
  },
  {
    name: "Sawangan",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Probolinggo",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Pelabuhanratu",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Palopo",
    country: "ID",
    timezone: "Asia/Makassar",
  },
  {
    name: "Labuan Bajo",
    country: "ID",
    timezone: "Asia/Makassar",
  },
  {
    name: "Jambi City",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Blitar",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Baubau",
    country: "ID",
    timezone: "Asia/Makassar",
  },
  {
    name: "Nottingham",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Tema",
    country: "GH",
    timezone: "Africa/Accra",
  },
  {
    name: "Oulu",
    country: "FI",
    timezone: "Europe/Helsinki",
  },
  {
    name: "Manama",
    country: "BH",
    timezone: "Asia/Bahrain",
  },
  {
    name: "Timon",
    country: "BR",
    timezone: "America/Fortaleza",
  },
  {
    name: "Mossoró",
    country: "BR",
    timezone: "America/Fortaleza",
  },
  {
    name: "Toledo",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "São Paulo",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "São José do Rio Preto",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Salto",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Resende",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Montes Claros",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Jequié",
    country: "BR",
    timezone: "America/Bahia",
  },
  {
    name: "Belford Roxo",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Gandajika",
    country: "CD",
    timezone: "Africa/Lubumbashi",
  },
  {
    name: "Valdivia",
    country: "CL",
    timezone: "America/Santiago",
  },
  {
    name: "Lianyungang",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Popayán",
    country: "CO",
    timezone: "America/Bogota",
  },
  {
    name: "Camagüey",
    country: "CU",
    timezone: "America/Havana",
  },
  {
    name: "Xinyi",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Xichang",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Xiaogan",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Taicang",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Luoyang",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Linxi",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Lecheng",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Guiyang",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Gaoping",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Ganzhou",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Fuji",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Shangyu",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Jiagedaqi",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Nārāyanganj",
    country: "BD",
    timezone: "Asia/Dhaka",
  },
  {
    name: "Abu Dhabi",
    country: "AE",
    timezone: "Asia/Dubai",
  },
  {
    name: "Rosario",
    country: "AR",
    timezone: "America/Argentina/Cordoba",
  },
  {
    name: "Linqu",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Olsztyn",
    country: "PL",
    timezone: "Europe/Warsaw",
  },
  {
    name: "Chorzów",
    country: "PL",
    timezone: "Europe/Warsaw",
  },
  {
    name: "Lisbon",
    country: "PT",
    timezone: "Europe/Lisbon",
  },
  {
    name: "Suceava",
    country: "RO",
    timezone: "Europe/Bucharest",
  },
  {
    name: "Piteşti",
    country: "RO",
    timezone: "Europe/Bucharest",
  },
  {
    name: "Playa del Carmen",
    country: "MX",
    timezone: "America/Cancun",
  },
  {
    name: "Ixtapaluca",
    country: "MX",
    timezone: "America/Mexico_City",
  },
  {
    name: "Cuernavaca",
    country: "MX",
    timezone: "America/Mexico_City",
  },
  {
    name: "Azcapotzalco",
    country: "MX",
    timezone: "America/Mexico_City",
  },
  {
    name: "Tlaquepaque",
    country: "MX",
    timezone: "America/Mexico_City",
  },
  {
    name: "Morelia",
    country: "MX",
    timezone: "America/Mexico_City",
  },
  {
    name: "Ciudad Benito Juárez",
    country: "MX",
    timezone: "America/Monterrey",
  },
  {
    name: "Parral",
    country: "MX",
    timezone: "America/Chihuahua",
  },
  {
    name: "Guadalupe",
    country: "MX",
    timezone: "America/Monterrey",
  },
  {
    name: "Victoria de Durango",
    country: "MX",
    timezone: "America/Monterrey",
  },
  {
    name: "Ciudad Guzmán",
    country: "MX",
    timezone: "America/Mexico_City",
  },
  {
    name: "Chihuahua",
    country: "MX",
    timezone: "America/Chihuahua",
  },
  {
    name: "Kota Kinabalu",
    country: "MY",
    timezone: "Asia/Kuching",
  },
  {
    name: "Alor Setar",
    country: "MY",
    timezone: "Asia/Kuala_Lumpur",
  },
  {
    name: "Kingston",
    country: "JM",
    timezone: "America/Jamaica",
  },
  {
    name: "Toyama",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Ōgaki",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Matsubara",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Koga",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Karatsu",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Kakogawachō-honmachi",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Obihiro",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Nairobi",
    country: "KE",
    timezone: "Africa/Nairobi",
  },
  {
    name: "Vientiane",
    country: "LA",
    timezone: "Asia/Vientiane",
  },
  {
    name: "Bender",
    country: "MD",
    timezone: "Europe/Chisinau",
  },
  {
    name: "Drammen",
    country: "NO",
    timezone: "Europe/Oslo",
  },
  {
    name: "North Shore",
    country: "NZ",
    timezone: "Pacific/Auckland",
  },
  {
    name: "Taguig",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Panalanoy",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Bacoor",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Sukkur",
    country: "PK",
    timezone: "Asia/Karachi",
  },
  {
    name: "Kot Addu",
    country: "PK",
    timezone: "Asia/Karachi",
  },
  {
    name: "Vladikavkaz",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Chandler",
    country: "US",
    timezone: "America/Phoenix",
  },
  {
    name: "Maryvale",
    country: "US",
    timezone: "America/Phoenix",
  },
  {
    name: "Concord",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Los Angeles",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Orange",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Pasadena",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Marg‘ilon",
    country: "UZ",
    timezone: "Asia/Tashkent",
  },
  {
    name: "Yaritagua",
    country: "VE",
    timezone: "America/Caracas",
  },
  {
    name: "Santa Teresa del Tuy",
    country: "VE",
    timezone: "America/Caracas",
  },
  {
    name: "Porlamar",
    country: "VE",
    timezone: "America/Caracas",
  },
  {
    name: "Cumaná",
    country: "VE",
    timezone: "America/Caracas",
  },
  {
    name: "Cần Giuộc",
    country: "VN",
    timezone: "Asia/Ho_Chi_Minh",
  },
  {
    name: "Davie",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Port Saint Lucie",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Tallahassee",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Indianapolis",
    country: "US",
    timezone: "America/Indiana/Indianapolis",
  },
  {
    name: "Denton",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "North Stamford",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Severnyy",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Nizhny Tagil",
    country: "RU",
    timezone: "Asia/Yekaterinburg",
  },
  {
    name: "Elista",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Barnaul",
    country: "RU",
    timezone: "Asia/Barnaul",
  },
  {
    name: "Akademicheskoe",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Centralniy",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Buraydah",
    country: "SA",
    timezone: "Asia/Riyadh",
  },
  {
    name: "Thiès",
    country: "SN",
    timezone: "Africa/Dakar",
  },
  {
    name: "Mogadishu",
    country: "SO",
    timezone: "Africa/Mogadishu",
  },
  {
    name: "Homs",
    country: "SY",
    timezone: "Asia/Damascus",
  },
  {
    name: "Aydın",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Ordu",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Banqiao",
    country: "TW",
    timezone: "Asia/Taipei",
  },
  {
    name: "Zhytomyr",
    country: "UA",
    timezone: "Europe/Kyiv",
  },
  {
    name: "Thuận An",
    country: "VN",
    timezone: "Asia/Ho_Chi_Minh",
  },
  {
    name: "Sanaa",
    country: "YE",
    timezone: "Asia/Aden",
  },
  {
    name: "Pretoria",
    country: "ZA",
    timezone: "Africa/Johannesburg",
  },
  {
    name: "Pietermaritzburg",
    country: "ZA",
    timezone: "Africa/Johannesburg",
  },
  {
    name: "Newark",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Corona",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Providence",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Tempe",
    country: "US",
    timezone: "America/Phoenix",
  },
  {
    name: "Moreno Valley",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Thousand Oaks",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Maracay",
    country: "VE",
    timezone: "America/Caracas",
  },
  {
    name: "Catia La Mar",
    country: "VE",
    timezone: "America/Caracas",
  },
  {
    name: "Acarigua",
    country: "VE",
    timezone: "America/Caracas",
  },
  {
    name: "Sóc Trăng",
    country: "VN",
    timezone: "Asia/Ho_Chi_Minh",
  },
  {
    name: "Kon Tum",
    country: "VN",
    timezone: "Asia/Ho_Chi_Minh",
  },
  {
    name: "Mykolayiv",
    country: "UA",
    timezone: "Europe/Kyiv",
  },
  {
    name: "Columbus",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Broken Arrow",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "College Station",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "Irving",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "Alexandria",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Arlington",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Hampton",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Naperville",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "Uşak",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Tarsus",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Umraniye",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Samsun",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Rize",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Nantou",
    country: "TW",
    timezone: "Asia/Taipei",
  },
  {
    name: "Tabora",
    country: "TZ",
    timezone: "Africa/Dar_es_Salaam",
  },
  {
    name: "Shinyanga",
    country: "TZ",
    timezone: "Africa/Dar_es_Salaam",
  },
  {
    name: "Ann Arbor",
    country: "US",
    timezone: "America/Detroit",
  },
  {
    name: "Virginia",
    country: "ZA",
    timezone: "Africa/Johannesburg",
  },
  {
    name: "eMbalenhle",
    country: "ZA",
    timezone: "Africa/Johannesburg",
  },
  {
    name: "Anderlecht",
    country: "BE",
    timezone: "Europe/Brussels",
  },
  {
    name: "Potosí",
    country: "BO",
    timezone: "America/La_Paz",
  },
  {
    name: "Oruro",
    country: "BO",
    timezone: "America/La_Paz",
  },
  {
    name: "Sumaré",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Ribeirão Pires",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Queimados",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Itu",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Itaquaquecetuba",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Itapevi",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Colombo",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Araras",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Lauro de Freitas",
    country: "BR",
    timezone: "America/Bahia",
  },
  {
    name: "London",
    country: "CA",
    timezone: "America/Toronto",
  },
  {
    name: "Longueuil",
    country: "CA",
    timezone: "America/Toronto",
  },
  {
    name: "Daoukro",
    country: "CI",
    timezone: "Africa/Abidjan",
  },
  {
    name: "Abidjan",
    country: "CI",
    timezone: "Africa/Abidjan",
  },
  {
    name: "Baku",
    country: "AZ",
    timezone: "Asia/Baku",
  },
  {
    name: "Balvanera",
    country: "AR",
    timezone: "America/Argentina/Buenos_Aires",
  },
  {
    name: "Łódź",
    country: "PL",
    timezone: "Europe/Warsaw",
  },
  {
    name: "Braga",
    country: "PT",
    timezone: "Europe/Lisbon",
  },
  {
    name: "Iaşi",
    country: "RO",
    timezone: "Europe/Bucharest",
  },
  {
    name: "Buzău",
    country: "RO",
    timezone: "Europe/Bucharest",
  },
  {
    name: "Veshnyaki",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Tehuacán",
    country: "MX",
    timezone: "America/Mexico_City",
  },
  {
    name: "Uruapan",
    country: "MX",
    timezone: "America/Mexico_City",
  },
  {
    name: "San Luis Río Colorado",
    country: "MX",
    timezone: "America/Hermosillo",
  },
  {
    name: "Manzanillo",
    country: "MX",
    timezone: "America/Mexico_City",
  },
  {
    name: "Gómez Palacio",
    country: "MX",
    timezone: "America/Monterrey",
  },
  {
    name: "Xai-Xai",
    country: "MZ",
    timezone: "Africa/Maputo",
  },
  {
    name: "Ondo",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Bauchi",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Yokohama",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Tokyo",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Kurume",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Fukui-shi",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Fujieda",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Fuji",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Tsukuba",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Mombasa",
    country: "KE",
    timezone: "Africa/Nairobi",
  },
  {
    name: "Ulsan",
    country: "KR",
    timezone: "Asia/Seoul",
  },
  {
    name: "Uijeongbu-si",
    country: "KR",
    timezone: "Asia/Seoul",
  },
  {
    name: "Sangju",
    country: "KR",
    timezone: "Asia/Seoul",
  },
  {
    name: "Gwangmyeong",
    country: "KR",
    timezone: "Asia/Seoul",
  },
  {
    name: "Ra’s Bayrūt",
    country: "LB",
    timezone: "Asia/Beirut",
  },
  {
    name: "Ajdabiya",
    country: "LY",
    timezone: "Africa/Tripoli",
  },
  {
    name: "Tétouan",
    country: "MA",
    timezone: "Africa/Casablanca",
  },
  {
    name: "Masaya",
    country: "NI",
    timezone: "America/Managua",
  },
  {
    name: "León",
    country: "NI",
    timezone: "America/Managua",
  },
  {
    name: "Venlo",
    country: "NL",
    timezone: "Europe/Amsterdam",
  },
  {
    name: "Bergen",
    country: "NO",
    timezone: "Europe/Oslo",
  },
  {
    name: "San Jose del Monte",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "San Jose",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Pulong Santa Cruz",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Iligan",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Budta",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Krasnodar",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Kirov",
    country: "RU",
    timezone: "Europe/Kirov",
  },
  {
    name: "Balashikha",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Chita",
    country: "RU",
    timezone: "Asia/Chita",
  },
  {
    name: "Cabudwaaq",
    country: "SO",
    timezone: "Africa/Addis_Ababa",
  },
  {
    name: "Ţarţūs",
    country: "SY",
    timezone: "Asia/Damascus",
  },
  {
    name: "Warangal",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Tiruchirappalli",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Surendranagar",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Nowrangapur",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Kashipur",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Karur",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Kāraikkudi",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Imphāl",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Gorakhpur",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Gondā City",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Gangāpur",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Darbhanga",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Sambhaji Nagar",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Ajmer",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Rohini",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Soran",
    country: "IQ",
    timezone: "Asia/Baghdad",
  },
  {
    name: "Rafsanjān",
    country: "IR",
    timezone: "Asia/Tehran",
  },
  {
    name: "Gonbad-e Kāvūs",
    country: "IR",
    timezone: "Asia/Tehran",
  },
  {
    name: "Kamoke",
    country: "PK",
    timezone: "Asia/Karachi",
  },
  {
    name: "Baoji",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Tuluá",
    country: "CO",
    timezone: "America/Bogota",
  },
  {
    name: "Rionegro",
    country: "CO",
    timezone: "America/Bogota",
  },
  {
    name: "Florencia",
    country: "CO",
    timezone: "America/Bogota",
  },
  {
    name: "Armenia",
    country: "CO",
    timezone: "America/Bogota",
  },
  {
    name: "Solingen",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Nantes",
    country: "FR",
    timezone: "Europe/Paris",
  },
  {
    name: "Woking",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Chemnitz",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Oum el Bouaghi",
    country: "DZ",
    timezone: "Africa/Algiers",
  },
  {
    name: "Béchar",
    country: "DZ",
    timezone: "Africa/Algiers",
  },
  {
    name: "Santo Domingo de los Colorados",
    country: "EC",
    timezone: "America/Guayaquil",
  },
  {
    name: "Latacunga",
    country: "EC",
    timezone: "America/Guayaquil",
  },
  {
    name: "Cuenca",
    country: "EC",
    timezone: "America/Guayaquil",
  },
  {
    name: "Kirdāsah",
    country: "EG",
    timezone: "Africa/Cairo",
  },
  {
    name: "Fāqūs",
    country: "EG",
    timezone: "Africa/Cairo",
  },
  {
    name: "Bilbays",
    country: "EG",
    timezone: "Africa/Cairo",
  },
  {
    name: "Al-'Ubūr",
    country: "EG",
    timezone: "Africa/Cairo",
  },
  {
    name: "Fuenlabrada",
    country: "ES",
    timezone: "Europe/Madrid",
  },
  {
    name: "Delicias",
    country: "ES",
    timezone: "Europe/Madrid",
  },
  {
    name: "Kombolcha",
    country: "ET",
    timezone: "Africa/Addis_Ababa",
  },
  {
    name: "Debre Mark’os",
    country: "ET",
    timezone: "Africa/Addis_Ababa",
  },
  {
    name: "Addis Ababa",
    country: "ET",
    timezone: "Africa/Addis_Ababa",
  },
  {
    name: "Jiayuguan",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Yongzhou",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Sanshui",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Xiangcheng",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Quanzhou",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Yizhou",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Nanchong",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Macheng",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Lu’an",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Jiaxing",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Huaihua",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Haikou",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Fuyang",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Changzhi",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Anqing",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Lianghu",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Yingkou",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Panshan",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Jiupu",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Petapa",
    country: "GT",
    timezone: "America/Guatemala",
  },
  {
    name: "Guatemala City",
    country: "GT",
    timezone: "America/Guatemala",
  },
  {
    name: "Chichicastenango",
    country: "GT",
    timezone: "America/Guatemala",
  },
  {
    name: "Split",
    country: "HR",
    timezone: "Europe/Zagreb",
  },
  {
    name: "Croix-des-Bouquets",
    country: "HT",
    timezone: "America/Port-au-Prince",
  },
  {
    name: "Perbaungan",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Lhokseumawe",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Serang",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Sepatan",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Loa Janan",
    country: "ID",
    timezone: "Asia/Makassar",
  },
  {
    name: "Lembang",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Fürth",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Erfurt",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Coventry",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Cardiff",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Birkenhead",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Medina Estates",
    country: "GH",
    timezone: "Africa/Accra",
  },
  {
    name: "Kathmandu",
    country: "NP",
    timezone: "Asia/Kathmandu",
  },
  {
    name: "Hamilton",
    country: "NZ",
    timezone: "Pacific/Auckland",
  },
  {
    name: "Rustaq",
    country: "OM",
    timezone: "Asia/Muscat",
  },
  {
    name: "Ica",
    country: "PE",
    timezone: "America/Lima",
  },
  {
    name: "Mandaluyong City",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Mabalacat City",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Las Piñas",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Cainta",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Cabuyao",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Vihari",
    country: "PK",
    timezone: "Asia/Karachi",
  },
  {
    name: "Tando Allahyar",
    country: "PK",
    timezone: "Asia/Karachi",
  },
  {
    name: "Wola",
    country: "PL",
    timezone: "Europe/Warsaw",
  },
  {
    name: "Ferrara",
    country: "IT",
    timezone: "Europe/Rome",
  },
  {
    name: "‘Ajlūn",
    country: "JO",
    timezone: "Asia/Amman",
  },
  {
    name: "Numazu",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Ashikaga",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Ichinoseki",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Inzai",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Ōsaki",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Higashimurayama",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Yamato",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Kikuyu",
    country: "KE",
    timezone: "Africa/Nairobi",
  },
  {
    name: "Chuncheon",
    country: "KR",
    timezone: "Asia/Seoul",
  },
  {
    name: "Oral",
    country: "KZ",
    timezone: "Asia/Oral",
  },
  {
    name: "Mohammedia",
    country: "MA",
    timezone: "Africa/Casablanca",
  },
  {
    name: "Podgorica",
    country: "ME",
    timezone: "Europe/Podgorica",
  },
  {
    name: "Yangon",
    country: "MM",
    timezone: "Asia/Yangon",
  },
  {
    name: "Reynosa",
    country: "MX",
    timezone: "America/Matamoros",
  },
  {
    name: "Iztacalco",
    country: "MX",
    timezone: "America/Mexico_City",
  },
  {
    name: "Chicoloapan",
    country: "MX",
    timezone: "America/Mexico_City",
  },
  {
    name: "Mazatlán",
    country: "MX",
    timezone: "America/Mazatlan",
  },
  {
    name: "Strasbourg",
    country: "FR",
    timezone: "Europe/Paris",
  },
  {
    name: "Mulhouse",
    country: "FR",
    timezone: "Europe/Paris",
  },
  {
    name: "Lille",
    country: "FR",
    timezone: "Europe/Paris",
  },
  {
    name: "Brest",
    country: "FR",
    timezone: "Europe/Paris",
  },
  {
    name: "Aix-en-Provence",
    country: "FR",
    timezone: "Europe/Paris",
  },
  {
    name: "Haifa",
    country: "IL",
    timezone: "Asia/Jerusalem",
  },
  {
    name: "Beersheba",
    country: "IL",
    timezone: "Asia/Jerusalem",
  },
  {
    name: "Varanasi",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Thrissur",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Titāgarh",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Sūjāngarh",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Rāmpur",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Puducherry",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Nagda",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Ingrāj Bāzār",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Kalaburagi",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Godhra",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Gandhinagar",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Bhopāl",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Bārākpur",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Agra",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Kanayannur",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Kirkuk",
    country: "IQ",
    timezone: "Asia/Baghdad",
  },
  {
    name: "Najaf",
    country: "IQ",
    timezone: "Asia/Baghdad",
  },
  {
    name: "Al Mawşil al Jadīdah",
    country: "IQ",
    timezone: "Asia/Baghdad",
  },
  {
    name: "Sanandaj",
    country: "IR",
    timezone: "Asia/Tehran",
  },
  {
    name: "Pārsābād",
    country: "IR",
    timezone: "Asia/Tehran",
  },
  {
    name: "Būkān",
    country: "IR",
    timezone: "Asia/Tehran",
  },
  {
    name: "Bojnūrd",
    country: "IR",
    timezone: "Asia/Tehran",
  },
  {
    name: "Reggio Calabria",
    country: "IT",
    timezone: "Europe/Rome",
  },
  {
    name: "Sha Tin",
    country: "HK",
    timezone: "Asia/Hong_Kong",
  },
  {
    name: "Tarakan",
    country: "ID",
    timezone: "Asia/Makassar",
  },
  {
    name: "Tangerang",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Purwodadi",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Jepara",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Bima",
    country: "ID",
    timezone: "Asia/Makassar",
  },
  {
    name: "Southampton",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Islington",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Obuase",
    country: "GH",
    timezone: "Africa/Accra",
  },
  {
    name: "Tawau",
    country: "MY",
    timezone: "Asia/Kuching",
  },
  {
    name: "Ipoh",
    country: "MY",
    timezone: "Asia/Kuala_Lumpur",
  },
  {
    name: "Kuantan",
    country: "MY",
    timezone: "Asia/Kuala_Lumpur",
  },
  {
    name: "Okigwe",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Maiduguri",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Ise-Ekiti",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Esuk Oron",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Ado-Ekiti",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Sorocaba",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Nilópolis",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Joinville",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Itajaí",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Ilhéus",
    country: "BR",
    timezone: "America/Bahia",
  },
  {
    name: "Guaratinguetá",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Divinópolis",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Cubatão",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Pinhais",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Mwene-Ditu",
    country: "CD",
    timezone: "Africa/Lubumbashi",
  },
  {
    name: "Pointe-Noire",
    country: "CG",
    timezone: "Africa/Brazzaville",
  },
  {
    name: "Brazzaville",
    country: "CG",
    timezone: "Africa/Brazzaville",
  },
  {
    name: "Dabou",
    country: "CI",
    timezone: "Africa/Abidjan",
  },
  {
    name: "Talca",
    country: "CL",
    timezone: "America/Santiago",
  },
  {
    name: "Itagüí",
    country: "CO",
    timezone: "America/Bogota",
  },
  {
    name: "Guanabacoa",
    country: "CU",
    timezone: "America/Havana",
  },
  {
    name: "Wuppertal",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Witten",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Curicó",
    country: "CL",
    timezone: "America/Santiago",
  },
  {
    name: "Copiapó",
    country: "CL",
    timezone: "America/Santiago",
  },
  {
    name: "Baoshan",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Heyuan",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Yixing",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Xinzhai",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Xigang",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Xiaogang",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Wuzhou",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Wanxian",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Qinzhou",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Wuwei",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Jingdezhen",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Hefei",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Handan",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Yangchun",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Jiangyin",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Xuanhua",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Shuangcheng",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Jessore",
    country: "BD",
    timezone: "Asia/Dhaka",
  },
  {
    name: "Paltan",
    country: "BD",
    timezone: "Asia/Dhaka",
  },
  {
    name: "Kunduz",
    country: "AF",
    timezone: "Asia/Kabul",
  },
  {
    name: "Concordia",
    country: "AR",
    timezone: "America/Argentina/Cordoba",
  },
  {
    name: "San Juan",
    country: "AR",
    timezone: "America/Argentina/San_Juan",
  },
  {
    name: "Catamarca",
    country: "AR",
    timezone: "America/Argentina/Catamarca",
  },
  {
    name: "Córdoba",
    country: "AR",
    timezone: "America/Argentina/Cordoba",
  },
  {
    name: "Donaustadt",
    country: "AT",
    timezone: "Europe/Vienna",
  },
  {
    name: "Toowoomba",
    country: "AU",
    timezone: "Australia/Brisbane",
  },
  {
    name: "Hobart",
    country: "AU",
    timezone: "Australia/Hobart",
  },
  {
    name: "Takatsuki",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Nara-shi",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Constanţa",
    country: "RO",
    timezone: "Europe/Bucharest",
  },
  {
    name: "Kakamigahara",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Ibaraki",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Hiratsuka",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Fukuyama",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Okinawa",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Abiko",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Novi Sad",
    country: "RS",
    timezone: "Europe/Belgrade",
  },
  {
    name: "Gangneung",
    country: "KR",
    timezone: "Asia/Seoul",
  },
  {
    name: "Hwado",
    country: "KR",
    timezone: "Asia/Seoul",
  },
  {
    name: "Rochester",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "Aktobe",
    country: "KZ",
    timezone: "Asia/Aqtobe",
  },
  {
    name: "Zawiya",
    country: "LY",
    timezone: "Africa/Tripoli",
  },
  {
    name: "Settat",
    country: "MA",
    timezone: "Africa/Casablanca",
  },
  {
    name: "Elmhurst",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Chisinau",
    country: "MD",
    timezone: "Europe/Chisinau",
  },
  {
    name: "Pathein",
    country: "MM",
    timezone: "Asia/Yangon",
  },
  {
    name: "Tiruppur",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Saugor",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Glendale",
    country: "US",
    timezone: "America/Phoenix",
  },
  {
    name: "Miriālgūda",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Kozhikode",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "El Monte",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Ontario",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Jūnāgadh",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Ichalkaranji",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Narmadapuram",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Alhambra",
    country: "US",
    timezone: "America/Phoenix",
  },
  {
    name: "Brahmapur",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Bīdar",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Bagaha",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Āsansol",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Abohar",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Soyībug",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Boulder",
    country: "US",
    timezone: "America/Denver",
  },
  {
    name: "Qūchān",
    country: "IR",
    timezone: "Asia/Tehran",
  },
  {
    name: "Khorramshahr",
    country: "IR",
    timezone: "Asia/Tehran",
  },
  {
    name: "Kerman",
    country: "IR",
    timezone: "Asia/Tehran",
  },
  {
    name: "Nukus",
    country: "UZ",
    timezone: "Asia/Samarkand",
  },
  {
    name: "Andijon",
    country: "UZ",
    timezone: "Asia/Tashkent",
  },
  {
    name: "Upata",
    country: "VE",
    timezone: "America/Caracas",
  },
  {
    name: "Guanare",
    country: "VE",
    timezone: "America/Caracas",
  },
  {
    name: "El Tigre",
    country: "VE",
    timezone: "America/Caracas",
  },
  {
    name: "Vĩnh Châu",
    country: "VN",
    timezone: "Asia/Ho_Chi_Minh",
  },
  {
    name: "Sa Dec",
    country: "VN",
    timezone: "Asia/Ho_Chi_Minh",
  },
  {
    name: "Haiphong",
    country: "VN",
    timezone: "Asia/Bangkok",
  },
  {
    name: "Solntsevo",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Rostov-na-Donu",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Novomoskovsk",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Ulan-Ude",
    country: "RU",
    timezone: "Asia/Irkutsk",
  },
  {
    name: "Ha'il",
    country: "SA",
    timezone: "Asia/Riyadh",
  },
  {
    name: "Arar",
    country: "SA",
    timezone: "Asia/Riyadh",
  },
  {
    name: "Touba",
    country: "SN",
    timezone: "Africa/Dakar",
  },
  {
    name: "Damascus",
    country: "SY",
    timezone: "Asia/Damascus",
  },
  {
    name: "Kara",
    country: "TG",
    timezone: "Africa/Lome",
  },
  {
    name: "Stoke-on-Trent",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Tunis",
    country: "TN",
    timezone: "Africa/Tunis",
  },
  {
    name: "Simferopol",
    country: "UA",
    timezone: "Europe/Simferopol",
  },
  {
    name: "Concepción de La Vega",
    country: "DO",
    timezone: "America/Santo_Domingo",
  },
  {
    name: "Saïda",
    country: "DZ",
    timezone: "Africa/Algiers",
  },
  {
    name: "Jijel",
    country: "DZ",
    timezone: "Africa/Algiers",
  },
  {
    name: "Bordj el Kiffan",
    country: "DZ",
    timezone: "Africa/Algiers",
  },
  {
    name: "Bab Ezzouar",
    country: "DZ",
    timezone: "Africa/Algiers",
  },
  {
    name: "Abū Kabīr",
    country: "EG",
    timezone: "Africa/Cairo",
  },
  {
    name: "Ivano-Frankivsk",
    country: "UA",
    timezone: "Europe/Kyiv",
  },
  {
    name: "Torrevieja",
    country: "ES",
    timezone: "Europe/Madrid",
  },
  {
    name: "Córdoba",
    country: "ES",
    timezone: "Europe/Madrid",
  },
  {
    name: "Louisville",
    country: "US",
    timezone: "America/Kentucky/Louisville",
  },
  {
    name: "Sants-Montjuïc",
    country: "ES",
    timezone: "Europe/Madrid",
  },
  {
    name: "Arganzuela",
    country: "ES",
    timezone: "Europe/Madrid",
  },
  {
    name: "Waterbury",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Puerto Barrios",
    country: "GT",
    timezone: "America/Guatemala",
  },
  {
    name: "Mixco",
    country: "GT",
    timezone: "America/Guatemala",
  },
  {
    name: "Chinautla",
    country: "GT",
    timezone: "America/Guatemala",
  },
  {
    name: "Siirt",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Kilis",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Singkawang",
    country: "ID",
    timezone: "Asia/Pontianak",
  },
  {
    name: "Purwakarta",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Kastamonu",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Metro",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Arnavutköy",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Manchester",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Huddersfield",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Port Elizabeth",
    country: "ZA",
    timezone: "Africa/Johannesburg",
  },
  {
    name: "Nigel",
    country: "ZA",
    timezone: "Africa/Johannesburg",
  },
  {
    name: "Cape Town",
    country: "ZA",
    timezone: "Africa/Johannesburg",
  },
  {
    name: "Dhamār",
    country: "YE",
    timezone: "Asia/Aden",
  },
  {
    name: "Pátra",
    country: "GR",
    timezone: "Europe/Athens",
  },
  {
    name: "Paderborn",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Cuautla",
    country: "MX",
    timezone: "America/Mexico_City",
  },
  {
    name: "Ressano Garcia",
    country: "MZ",
    timezone: "Africa/Maputo",
  },
  {
    name: "Ugep",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Suleja",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Okrika",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Lafia",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Jalingo",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Ijero-Ekiti",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Gombe",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Bytom",
    country: "PL",
    timezone: "Europe/Warsaw",
  },
  {
    name: "Satu Mare",
    country: "RO",
    timezone: "Europe/Bucharest",
  },
  {
    name: "Zyuzino",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Zhulebino",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Volzhsky",
    country: "RU",
    timezone: "Europe/Volgograd",
  },
  {
    name: "Oslo",
    country: "NO",
    timezone: "Europe/Oslo",
  },
  {
    name: "Biratnagar",
    country: "NP",
    timezone: "Asia/Kathmandu",
  },
  {
    name: "Nepalgunj",
    country: "NP",
    timezone: "Asia/Kathmandu",
  },
  {
    name: "Sohar",
    country: "OM",
    timezone: "Asia/Muscat",
  },
  {
    name: "‘Ibrī",
    country: "OM",
    timezone: "Asia/Muscat",
  },
  {
    name: "Urdaneta",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Santiago",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Santa Rosa",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Muricay",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Cavite City",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Caloocan City",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Cabanatuan City",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Sialkot",
    country: "PK",
    timezone: "Asia/Karachi",
  },
  {
    name: "Malir Cantonment",
    country: "PK",
    timezone: "Asia/Karachi",
  },
  {
    name: "Kasur",
    country: "PK",
    timezone: "Asia/Karachi",
  },
  {
    name: "Bielany",
    country: "PL",
    timezone: "Europe/Warsaw",
  },
  {
    name: "Wrocław",
    country: "PL",
    timezone: "Europe/Warsaw",
  },
  {
    name: "Włocławek",
    country: "PL",
    timezone: "Europe/Warsaw",
  },
  {
    name: "Szczecin",
    country: "PL",
    timezone: "Europe/Warsaw",
  },
  {
    name: "Taganrog",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Xingning",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Puyang",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Valledupar",
    country: "CO",
    timezone: "America/Bogota",
  },
  {
    name: "Saint Paul",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "Manizales",
    country: "CO",
    timezone: "America/Bogota",
  },
  {
    name: "Ibagué",
    country: "CO",
    timezone: "America/Bogota",
  },
  {
    name: "Staten Island",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Pilsen",
    country: "CZ",
    timezone: "Europe/Prague",
  },
  {
    name: "Wilmersdorf",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Trier",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Fontana",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Enterprise",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Sucre",
    country: "BO",
    timezone: "America/La_Paz",
  },
  {
    name: "Bellevue",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Ananindeua",
    country: "BR",
    timezone: "America/Belem",
  },
  {
    name: "Sapucaia",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Honolulu",
    country: "US",
    timezone: "Pacific/Honolulu",
  },
  {
    name: "Jacareí",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Birigui",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Barueri",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Parauapebas",
    country: "BR",
    timezone: "America/Belem",
  },
  {
    name: "Mahilyow",
    country: "BY",
    timezone: "Europe/Minsk",
  },
  {
    name: "Ciudad Guayana",
    country: "VE",
    timezone: "America/Caracas",
  },
  {
    name: "Barcelona",
    country: "VE",
    timezone: "America/Caracas",
  },
  {
    name: "Thới Lai",
    country: "VN",
    timezone: "Asia/Ho_Chi_Minh",
  },
  {
    name: "Ho Chi Minh City",
    country: "VN",
    timezone: "Asia/Ho_Chi_Minh",
  },
  {
    name: "Đưc Trọng",
    country: "VN",
    timezone: "Asia/Ho_Chi_Minh",
  },
  {
    name: "Đồng Hới",
    country: "VN",
    timezone: "Asia/Bangkok",
  },
  {
    name: "Buôn Ma Thuột",
    country: "VN",
    timezone: "Asia/Ho_Chi_Minh",
  },
  {
    name: "Ryazan’",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Sherbrooke",
    country: "CA",
    timezone: "America/Toronto",
  },
  {
    name: "Zürich",
    country: "CH",
    timezone: "Europe/Zurich",
  },
  {
    name: "Khasavyurt",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Kamyshin",
    country: "RU",
    timezone: "Europe/Volgograd",
  },
  {
    name: "Kaliningrad",
    country: "RU",
    timezone: "Europe/Kaliningrad",
  },
  {
    name: "Dzerzhinsk",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Norilsk",
    country: "RU",
    timezone: "Asia/Krasnoyarsk",
  },
  {
    name: "Talcahuano",
    country: "CL",
    timezone: "America/Santiago",
  },
  {
    name: "Rancagua",
    country: "CL",
    timezone: "America/Santiago",
  },
  {
    name: "Khabarovsk Vtoroy",
    country: "RU",
    timezone: "Asia/Vladivostok",
  },
  {
    name: "Al Mubarraz",
    country: "SA",
    timezone: "Asia/Riyadh",
  },
  {
    name: "Copenhagen",
    country: "DK",
    timezone: "Europe/Copenhagen",
  },
  {
    name: "El Achir",
    country: "DZ",
    timezone: "Africa/Algiers",
  },
  {
    name: "San Salvador",
    country: "SV",
    timezone: "America/El_Salvador",
  },
  {
    name: "Bokhtar",
    country: "TJ",
    timezone: "Asia/Dushanbe",
  },
  {
    name: "Nikopol",
    country: "UA",
    timezone: "Europe/Kyiv",
  },
  {
    name: "Melitopol",
    country: "UA",
    timezone: "Europe/Kyiv",
  },
  {
    name: "Brandon",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Coral Springs",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Los Ángeles",
    country: "CL",
    timezone: "America/Santiago",
  },
  {
    name: "Antofagasta",
    country: "CL",
    timezone: "America/Santiago",
  },
  {
    name: "Shache",
    country: "CN",
    timezone: "Asia/Urumqi",
  },
  {
    name: "Yili",
    country: "CN",
    timezone: "Asia/Urumqi",
  },
  {
    name: "Zitong",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Yuci",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Qianjiang",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Xinyang",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Wuxue",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Weinan",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Wanning",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Wafangdian",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Shijiazhuang",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Shahecheng",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Laiwu",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Kaiyuan",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Jinzhou",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Huanggang",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Hengyang",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Hanfeng",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Dali",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Jishu",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "East Chattanooga",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Changchun",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Round Rock",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "Tyler",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "Ganja",
    country: "AZ",
    timezone: "Asia/Baku",
  },
  {
    name: "Sirajganj",
    country: "BD",
    timezone: "Asia/Dhaka",
  },
  {
    name: "Osnabrück",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Oldenburg",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Turku",
    country: "FI",
    timezone: "Europe/Helsinki",
  },
  {
    name: "Adıyaman",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Gebze",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Songea",
    country: "TZ",
    timezone: "Africa/Dar_es_Salaam",
  },
  {
    name: "Quận Đức Thịnh",
    country: "VN",
    timezone: "Asia/Ho_Chi_Minh",
  },
  {
    name: "Al Ḩudaydah",
    country: "YE",
    timezone: "Asia/Aden",
  },
  {
    name: "Soweto",
    country: "ZA",
    timezone: "Africa/Johannesburg",
  },
  {
    name: "Mokopane",
    country: "ZA",
    timezone: "Africa/Johannesburg",
  },
  {
    name: "Nelspruit",
    country: "ZA",
    timezone: "Africa/Johannesburg",
  },
  {
    name: "George",
    country: "ZA",
    timezone: "Africa/Johannesburg",
  },
  {
    name: "Benoni",
    country: "ZA",
    timezone: "Africa/Johannesburg",
  },
  {
    name: "Epworth",
    country: "ZW",
    timezone: "Africa/Harare",
  },
  {
    name: "Salavat",
    country: "RU",
    timezone: "Asia/Yekaterinburg",
  },
  {
    name: "Penza",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Cherëmushki",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Tabuk",
    country: "SA",
    timezone: "Asia/Riyadh",
  },
  {
    name: "Khamis Mushait",
    country: "SA",
    timezone: "Asia/Riyadh",
  },
  {
    name: "Riyadh",
    country: "SA",
    timezone: "Asia/Riyadh",
  },
  {
    name: "Al Hufūf",
    country: "SA",
    timezone: "Asia/Riyadh",
  },
  {
    name: "Kassala",
    country: "SD",
    timezone: "Africa/Khartoum",
  },
  {
    name: "Helsingborg",
    country: "SE",
    timezone: "Europe/Stockholm",
  },
  {
    name: "Ḩamāh",
    country: "SY",
    timezone: "Asia/Damascus",
  },
  {
    name: "Surat Thani",
    country: "TH",
    timezone: "Asia/Bangkok",
  },
  {
    name: "Nakhon Pathom",
    country: "TH",
    timezone: "Asia/Bangkok",
  },
  {
    name: "Khon Kaen",
    country: "TH",
    timezone: "Asia/Bangkok",
  },
  {
    name: "Mardin",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Manisa",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Kütahya",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Tekirdağ",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Şişli",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Douliu",
    country: "TW",
    timezone: "Asia/Taipei",
  },
  {
    name: "Sanxia",
    country: "TW",
    timezone: "Asia/Taipei",
  },
  {
    name: "Bemowo",
    country: "PL",
    timezone: "Europe/Warsaw",
  },
  {
    name: "Rafaḩ",
    country: "PS",
    timezone: "Asia/Gaza",
  },
  {
    name: "Funchal",
    country: "PT",
    timezone: "Atlantic/Madeira",
  },
  {
    name: "Galaţi",
    country: "RO",
    timezone: "Europe/Bucharest",
  },
  {
    name: "Yelets",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Yasenevo",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Edison",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Washington Heights",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Fullerton",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Garden Grove",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "San Francisco",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Santa Rosa",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Qo‘qon",
    country: "UZ",
    timezone: "Asia/Tashkent",
  },
  {
    name: "Guacara",
    country: "VE",
    timezone: "America/Caracas",
  },
  {
    name: "Ejido",
    country: "VE",
    timezone: "America/Caracas",
  },
  {
    name: "Coro",
    country: "VE",
    timezone: "America/Caracas",
  },
  {
    name: "Kropyvnytskyy",
    country: "UA",
    timezone: "Europe/Kyiv",
  },
  {
    name: "Kamyanske",
    country: "UA",
    timezone: "Europe/Kyiv",
  },
  {
    name: "Topeka",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "Wichita",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "Shreveport",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "High Point",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Dallas",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "Pasadena",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "South Boston",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Sumy",
    country: "UA",
    timezone: "Europe/Kyiv",
  },
  {
    name: "Mpumalanga",
    country: "ZA",
    timezone: "Africa/Johannesburg",
  },
  {
    name: "Klerksdorp",
    country: "ZA",
    timezone: "Africa/Johannesburg",
  },
  {
    name: "Brits",
    country: "ZA",
    timezone: "Africa/Johannesburg",
  },
  {
    name: "Ojo de Agua",
    country: "MX",
    timezone: "America/Mexico_City",
  },
  {
    name: "Los Mochis",
    country: "MX",
    timezone: "America/Mazatlan",
  },
  {
    name: "Cuauhtémoc",
    country: "MX",
    timezone: "America/Chihuahua",
  },
  {
    name: "Sandakan",
    country: "MY",
    timezone: "Asia/Kuching",
  },
  {
    name: "Pemba",
    country: "MZ",
    timezone: "Africa/Maputo",
  },
  {
    name: "Matola",
    country: "MZ",
    timezone: "Africa/Maputo",
  },
  {
    name: "Mandimba",
    country: "MZ",
    timezone: "Africa/Maputo",
  },
  {
    name: "Zinder",
    country: "NE",
    timezone: "Africa/Niamey",
  },
  {
    name: "Saki",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Pindiga",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Enugu",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Abakaliki",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Zama",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Yonago",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Suzuka",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Shizuoka",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Kakegawa",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Isesaki",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Hōfu",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Himeji",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Amagasaki",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Hakodate",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Kisumu",
    country: "KE",
    timezone: "Africa/Nairobi",
  },
  {
    name: "Hamhŭng",
    country: "KP",
    timezone: "Asia/Pyongyang",
  },
  {
    name: "Seoul",
    country: "KR",
    timezone: "Asia/Seoul",
  },
  {
    name: "Shevchenko",
    country: "KZ",
    timezone: "Asia/Aqtau",
  },
  {
    name: "Savannakhet",
    country: "LA",
    timezone: "Asia/Vientiane",
  },
  {
    name: "Negombo",
    country: "LK",
    timezone: "Asia/Colombo",
  },
  {
    name: "Benghazi",
    country: "LY",
    timezone: "Africa/Tripoli",
  },
  {
    name: "Taza",
    country: "MA",
    timezone: "Africa/Casablanca",
  },
  {
    name: "Safi",
    country: "MA",
    timezone: "Africa/Casablanca",
  },
  {
    name: "Sittwe",
    country: "MM",
    timezone: "Asia/Yangon",
  },
  {
    name: "Pyay",
    country: "MM",
    timezone: "Asia/Yangon",
  },
  {
    name: "Bago",
    country: "MM",
    timezone: "Asia/Yangon",
  },
  {
    name: "Monywa",
    country: "MM",
    timezone: "Asia/Yangon",
  },
  {
    name: "Meiktila",
    country: "MM",
    timezone: "Asia/Yangon",
  },
  {
    name: "Juan Díaz",
    country: "PA",
    timezone: "America/Panama",
  },
  {
    name: "Sullana",
    country: "PE",
    timezone: "America/Lima",
  },
  {
    name: "Puerto Princesa",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Gujrat",
    country: "PK",
    timezone: "Asia/Karachi",
  },
  {
    name: "Leiden",
    country: "NL",
    timezone: "Europe/Amsterdam",
  },
  {
    name: "Toulon",
    country: "FR",
    timezone: "Europe/Paris",
  },
  {
    name: "Saint-Étienne",
    country: "FR",
    timezone: "Europe/Paris",
  },
  {
    name: "Montreuil",
    country: "FR",
    timezone: "Europe/Paris",
  },
  {
    name: "Limoges",
    country: "FR",
    timezone: "Europe/Paris",
  },
  {
    name: "Angers",
    country: "FR",
    timezone: "Europe/Paris",
  },
  {
    name: "Watford",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Odense",
    country: "DK",
    timezone: "Europe/Copenhagen",
  },
  {
    name: "Bordj Bou Arréridj",
    country: "DZ",
    timezone: "Africa/Algiers",
  },
  {
    name: "Leganés",
    country: "ES",
    timezone: "Europe/Madrid",
  },
  {
    name: "Getafe",
    country: "ES",
    timezone: "Europe/Madrid",
  },
  {
    name: "Bilbao",
    country: "ES",
    timezone: "Europe/Madrid",
  },
  {
    name: "Alcalá de Henares",
    country: "ES",
    timezone: "Europe/Madrid",
  },
  {
    name: "Kanchipuram",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Hubli",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Ellore",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Dharmavaram",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Bhind",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Bhātpāra",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Bellary",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Bānkura",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Arrah",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Az Zubayr",
    country: "IQ",
    timezone: "Asia/Baghdad",
  },
  {
    name: "Āzādshahr",
    country: "IR",
    timezone: "Asia/Tehran",
  },
  {
    name: "San Juan Sacatepéquez",
    country: "GT",
    timezone: "America/Guatemala",
  },
  {
    name: "Kwai Chung",
    country: "HK",
    timezone: "Asia/Hong_Kong",
  },
  {
    name: "Zagreb",
    country: "HR",
    timezone: "Europe/Zagreb",
  },
  {
    name: "Cap-Haïtien",
    country: "HT",
    timezone: "America/Port-au-Prince",
  },
  {
    name: "Szeged",
    country: "HU",
    timezone: "Europe/Budapest",
  },
  {
    name: "Rangkasbitung",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Pangkalpinang",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Leipzig",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Krefeld",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Hannover",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Düsseldorf",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Sheffield",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Portsmouth",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Camayenne",
    country: "GN",
    timezone: "Africa/Conakry",
  },
  {
    name: "Malabo",
    country: "GQ",
    timezone: "Africa/Malabo",
  },
  {
    name: "Reẖovot",
    country: "IL",
    timezone: "Asia/Jerusalem",
  },
  {
    name: "Ooty",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Tādepallegūdem",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Shimla",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Ratlām",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Rānīganj",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Patiāla",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Pāli",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Pālanpur",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Nalgonda",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Muzaffarpur",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Moga",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Meerut",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Rugao",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Sogamoso",
    country: "CO",
    timezone: "America/Bogota",
  },
  {
    name: "Cartago",
    country: "CO",
    timezone: "America/Bogota",
  },
  {
    name: "Cali",
    country: "CO",
    timezone: "America/Bogota",
  },
  {
    name: "Koudougou",
    country: "BF",
    timezone: "Africa/Ouagadougou",
  },
  {
    name: "Pleven",
    country: "BG",
    timezone: "Europe/Sofia",
  },
  {
    name: "Burgas",
    country: "BG",
    timezone: "Europe/Sofia",
  },
  {
    name: "Djougou",
    country: "BJ",
    timezone: "Africa/Porto-Novo",
  },
  {
    name: "Abomey-Calavi",
    country: "BJ",
    timezone: "Africa/Porto-Novo",
  },
  {
    name: "Vitória de Santo Antão",
    country: "BR",
    timezone: "America/Recife",
  },
  {
    name: "Teresina",
    country: "BR",
    timezone: "America/Fortaleza",
  },
  {
    name: "Santa Maria",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Poá",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Cotia",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Atibaia",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Gaborone",
    country: "BW",
    timezone: "Africa/Gaborone",
  },
  {
    name: "Mazyr",
    country: "BY",
    timezone: "Europe/Minsk",
  },
  {
    name: "Abbotsford",
    country: "CA",
    timezone: "America/Vancouver",
  },
  {
    name: "Thunder Bay",
    country: "CA",
    timezone: "America/Toronto",
  },
  {
    name: "Matadi",
    country: "CD",
    timezone: "Africa/Kinshasa",
  },
  {
    name: "Kikwit",
    country: "CD",
    timezone: "Africa/Kinshasa",
  },
  {
    name: "Gemena",
    country: "CD",
    timezone: "Africa/Kinshasa",
  },
  {
    name: "Loum",
    country: "CM",
    timezone: "Africa/Douala",
  },
  {
    name: "Douala",
    country: "CM",
    timezone: "Africa/Douala",
  },
  {
    name: "Kashgar",
    country: "CN",
    timezone: "Asia/Urumqi",
  },
  {
    name: "Zibo",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Jinghong",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Yanzhou",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Xintai",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Wuhai",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Tianshui",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Shilong",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Qiaotou",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Laibin",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Jianchang",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Duyun",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Deyang",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Zhangjiajie",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Baoding",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Zhalantun",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Yushu",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Yakeshi",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Chifeng",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Dubai",
    country: "AE",
    timezone: "Asia/Dubai",
  },
  {
    name: "Balkh",
    country: "AF",
    timezone: "Asia/Kabul",
  },
  {
    name: "Corrientes",
    country: "AR",
    timezone: "America/Argentina/Cordoba",
  },
  {
    name: "Remscheid",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Jabālyā",
    country: "PS",
    timezone: "Asia/Gaza",
  },
  {
    name: "Fernando de la Mora",
    country: "PY",
    timezone: "America/Asuncion",
  },
  {
    name: "Braşov",
    country: "RO",
    timezone: "Europe/Bucharest",
  },
  {
    name: "Sector 1",
    country: "RO",
    timezone: "Europe/Bucharest",
  },
  {
    name: "Caen",
    country: "FR",
    timezone: "Europe/Paris",
  },
  {
    name: "El Eulma",
    country: "DZ",
    timezone: "Africa/Algiers",
  },
  {
    name: "Ech Chettia",
    country: "DZ",
    timezone: "Africa/Algiers",
  },
  {
    name: "Valencia",
    country: "ES",
    timezone: "Europe/Madrid",
  },
  {
    name: "A Coruña",
    country: "ES",
    timezone: "Europe/Madrid",
  },
  {
    name: "Ciutat Vella",
    country: "ES",
    timezone: "Europe/Madrid",
  },
  {
    name: "Latina",
    country: "ES",
    timezone: "Europe/Madrid",
  },
  {
    name: "Debre Tabor",
    country: "ET",
    timezone: "Africa/Addis_Ababa",
  },
  {
    name: "Edéa",
    country: "CM",
    timezone: "Africa/Douala",
  },
  {
    name: "Korla",
    country: "CN",
    timezone: "Asia/Urumqi",
  },
  {
    name: "Dunhuang",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Zaozhuang",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Xiuying",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Xiamen",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Chengtangcun",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Binhe",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Shenzhen",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Pingxiang",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Maoming",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Lishui",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Qingnian",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Daxing",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Dezhou",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Datun",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Changsha",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Anshun",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Hedong",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Siping",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Shunyi",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Shuangyashan",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Qitaihe",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Jiamusi",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Shāhzādpur",
    country: "BD",
    timezone: "Asia/Dhaka",
  },
  {
    name: "Comilla",
    country: "BD",
    timezone: "Asia/Dhaka",
  },
  {
    name: "Sonārgaon",
    country: "BD",
    timezone: "Asia/Dhaka",
  },
  {
    name: "Farīdpur",
    country: "BD",
    timezone: "Asia/Dhaka",
  },
  {
    name: "Durrës",
    country: "AL",
    timezone: "Europe/Tirane",
  },
  {
    name: "Posadas",
    country: "AR",
    timezone: "America/Argentina/Cordoba",
  },
  {
    name: "Belgrano",
    country: "AR",
    timezone: "America/Argentina/Buenos_Aires",
  },
  {
    name: "San Miguel de Tucumán",
    country: "AR",
    timezone: "America/Argentina/Tucuman",
  },
  {
    name: "Porz am Rhein",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Neue Neustadt",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Moers",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Veracruz",
    country: "MX",
    timezone: "America/Mexico_City",
  },
  {
    name: "San Juan del Río",
    country: "MX",
    timezone: "America/Mexico_City",
  },
  {
    name: "Oaxaca",
    country: "MX",
    timezone: "America/Mexico_City",
  },
  {
    name: "Minatitlán",
    country: "MX",
    timezone: "America/Mexico_City",
  },
  {
    name: "Ecatepec de Morelos",
    country: "MX",
    timezone: "America/Mexico_City",
  },
  {
    name: "Cancún",
    country: "MX",
    timezone: "America/Cancun",
  },
  {
    name: "Hermosillo",
    country: "MX",
    timezone: "America/Hermosillo",
  },
  {
    name: "Petaling Jaya",
    country: "MY",
    timezone: "Asia/Kuala_Lumpur",
  },
  {
    name: "Pasir Mas",
    country: "MY",
    timezone: "Asia/Kuala_Lumpur",
  },
  {
    name: "Zaria",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Nkpor",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Zwolle",
    country: "NL",
    timezone: "Europe/Amsterdam",
  },
  {
    name: "Enschede",
    country: "NL",
    timezone: "Europe/Amsterdam",
  },
  {
    name: "Arequipa",
    country: "PE",
    timezone: "America/Lima",
  },
  {
    name: "Tacloban",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Bulaon",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Tordher",
    country: "PK",
    timezone: "Asia/Karachi",
  },
  {
    name: "Shikarpur",
    country: "PK",
    timezone: "Asia/Karachi",
  },
  {
    name: "Muzaffargarh",
    country: "PK",
    timezone: "Asia/Karachi",
  },
  {
    name: "Multan",
    country: "PK",
    timezone: "Asia/Karachi",
  },
  {
    name: "Mandi Bahauddin",
    country: "PK",
    timezone: "Asia/Karachi",
  },
  {
    name: "Khanpur",
    country: "PK",
    timezone: "Asia/Karachi",
  },
  {
    name: "Chishtian",
    country: "PK",
    timezone: "Asia/Karachi",
  },
  {
    name: "Bahawalnagar",
    country: "PK",
    timezone: "Asia/Karachi",
  },
  {
    name: "Acilia-Castel Fusano-Ostia Antica",
    country: "IT",
    timezone: "Europe/Rome",
  },
  {
    name: "Uji",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Tokushima",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Shimonoseki",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Sakai",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Odawara",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Noda",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Nagoya",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Koshigaya",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Nasushiobara",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Siem Reap",
    country: "KH",
    timezone: "Asia/Phnom_Penh",
  },
  {
    name: "Al Aḩmadī",
    country: "KW",
    timezone: "Asia/Kuwait",
  },
  {
    name: "Beirut",
    country: "LB",
    timezone: "Asia/Beirut",
  },
  {
    name: "Nabatîyé et Tahta",
    country: "LB",
    timezone: "Asia/Beirut",
  },
  {
    name: "Moratuwa",
    country: "LK",
    timezone: "Asia/Colombo",
  },
  {
    name: "Jaffna",
    country: "LK",
    timezone: "Asia/Colombo",
  },
  {
    name: "Larache",
    country: "MA",
    timezone: "Africa/Casablanca",
  },
  {
    name: "Kenitra",
    country: "MA",
    timezone: "Africa/Casablanca",
  },
  {
    name: "Ségou",
    country: "ML",
    timezone: "Africa/Bamako",
  },
  {
    name: "Lilongwe",
    country: "MW",
    timezone: "Africa/Blantyre",
  },
  {
    name: "Xico",
    country: "MX",
    timezone: "America/Mexico_City",
  },
  {
    name: "Rochester",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Norwalk",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "San Angelo",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "Gresham",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Montevideo",
    country: "UY",
    timezone: "America/Montevideo",
  },
  {
    name: "Valencia",
    country: "VE",
    timezone: "America/Caracas",
  },
  {
    name: "El Vigía",
    country: "VE",
    timezone: "America/Caracas",
  },
  {
    name: "Cúa",
    country: "VE",
    timezone: "America/Caracas",
  },
  {
    name: "Nha Trang",
    country: "VN",
    timezone: "Asia/Ho_Chi_Minh",
  },
  {
    name: "Kharkiv",
    country: "UA",
    timezone: "Europe/Kyiv",
  },
  {
    name: "Alchevsk",
    country: "UA",
    timezone: "Europe/Kyiv",
  },
  {
    name: "Huntsville",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "Miramar",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Palm Bay",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Peoria",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "Brussels",
    country: "BE",
    timezone: "Europe/Brussels",
  },
  {
    name: "Plovdiv",
    country: "BG",
    timezone: "Europe/Sofia",
  },
  {
    name: "Cotonou",
    country: "BJ",
    timezone: "Africa/Porto-Novo",
  },
  {
    name: "Sobral",
    country: "BR",
    timezone: "America/Fortaleza",
  },
  {
    name: "Santa Rita",
    country: "BR",
    timezone: "America/Fortaleza",
  },
  {
    name: "Santarém",
    country: "BR",
    timezone: "America/Santarem",
  },
  {
    name: "Garanhuns",
    country: "BR",
    timezone: "America/Recife",
  },
  {
    name: "São Bernardo do Campo",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Santa Cruz do Sul",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Rio Grande",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Porto Alegre",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Maringá",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Juiz de Fora",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Feira de Santana",
    country: "BR",
    timezone: "America/Bahia",
  },
  {
    name: "Minsk",
    country: "BY",
    timezone: "Europe/Minsk",
  },
  {
    name: "Barrie",
    country: "CA",
    timezone: "America/Toronto",
  },
  {
    name: "Gatineau",
    country: "CA",
    timezone: "America/Toronto",
  },
  {
    name: "Nepean",
    country: "CA",
    timezone: "America/Toronto",
  },
  {
    name: "Lubumbashi",
    country: "CD",
    timezone: "Africa/Lubumbashi",
  },
  {
    name: "Genève",
    country: "CH",
    timezone: "Europe/Zurich",
  },
  {
    name: "Man",
    country: "CI",
    timezone: "Africa/Abidjan",
  },
  {
    name: "Temuco",
    country: "CL",
    timezone: "America/Santiago",
  },
  {
    name: "Springfield",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Randfontein",
    country: "ZA",
    timezone: "Africa/Johannesburg",
  },
  {
    name: "Middelburg",
    country: "ZA",
    timezone: "Africa/Johannesburg",
  },
  {
    name: "Krugersdorp",
    country: "ZA",
    timezone: "Africa/Johannesburg",
  },
  {
    name: "Luanshya",
    country: "ZM",
    timezone: "Africa/Lusaka",
  },
  {
    name: "Katumba",
    country: "TZ",
    timezone: "Africa/Dar_es_Salaam",
  },
  {
    name: "Dodoma",
    country: "TZ",
    timezone: "Africa/Dar_es_Salaam",
  },
  {
    name: "Saratov",
    country: "RU",
    timezone: "Europe/Saratov",
  },
  {
    name: "Bryansk",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Kamensk-Ural’skiy",
    country: "RU",
    timezone: "Asia/Yekaterinburg",
  },
  {
    name: "Nakhodka",
    country: "RU",
    timezone: "Asia/Vladivostok",
  },
  {
    name: "Ed Damer",
    country: "SD",
    timezone: "Africa/Khartoum",
  },
  {
    name: "Paramaribo",
    country: "SR",
    timezone: "America/Paramaribo",
  },
  {
    name: "San Miguel",
    country: "SV",
    timezone: "America/El_Salvador",
  },
  {
    name: "Apopa",
    country: "SV",
    timezone: "America/El_Salvador",
  },
  {
    name: "Sivas",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "İnegol",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Bahçelievler",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Pasto",
    country: "CO",
    timezone: "America/Bogota",
  },
  {
    name: "Girón",
    country: "CO",
    timezone: "America/Bogota",
  },
  {
    name: "Pinar del Río",
    country: "CU",
    timezone: "America/Havana",
  },
  {
    name: "Srinagar",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Phagwāra",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Kharagpur",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Guna",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Durgapur",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Balasore",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Mohali",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Gajuwaka",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Isfahan",
    country: "IR",
    timezone: "Asia/Tehran",
  },
  {
    name: "Tin Shui Wai",
    country: "HK",
    timezone: "Asia/Hong_Kong",
  },
  {
    name: "Paseh",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Kresek",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Cimahi",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Cibinong",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Batang",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Middlesbrough",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Cambridge",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Takoradi",
    country: "GH",
    timezone: "Africa/Accra",
  },
  {
    name: "Conakry",
    country: "GN",
    timezone: "Africa/Conakry",
  },
  {
    name: "Volgodonsk",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Troparëvo",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Syzran",
    country: "RU",
    timezone: "Europe/Samara",
  },
  {
    name: "Staryy Oskol",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Álvaro Obregón",
    country: "MX",
    timezone: "America/Mexico_City",
  },
  {
    name: "Villahermosa",
    country: "MX",
    timezone: "America/Mexico_City",
  },
  {
    name: "Nicolás Romero",
    country: "MX",
    timezone: "America/Mexico_City",
  },
  {
    name: "Miguel Hidalgo",
    country: "MX",
    timezone: "America/Mexico_City",
  },
  {
    name: "Soledad de Graciano Sánchez",
    country: "MX",
    timezone: "America/Mexico_City",
  },
  {
    name: "Batu Pahat",
    country: "MY",
    timezone: "Asia/Kuala_Lumpur",
  },
  {
    name: "Muar",
    country: "MY",
    timezone: "Asia/Kuala_Lumpur",
  },
  {
    name: "Klang",
    country: "MY",
    timezone: "Asia/Kuala_Lumpur",
  },
  {
    name: "Makurdi",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Płock",
    country: "PL",
    timezone: "Europe/Warsaw",
  },
  {
    name: "Gaza",
    country: "PS",
    timezone: "Asia/Gaza",
  },
  {
    name: "Queluz",
    country: "PT",
    timezone: "Europe/Lisbon",
  },
  {
    name: "Asunción",
    country: "PY",
    timezone: "America/Asuncion",
  },
  {
    name: "Uitenhage",
    country: "ZA",
    timezone: "Africa/Johannesburg",
  },
  {
    name: "Dublin",
    country: "IE",
    timezone: "Europe/Dublin",
  },
  {
    name: "Silchar",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Satara",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Salem",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Ongole",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Nagpur",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Nāgercoil",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Kolhāpur",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Cuttack",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Kumarapalayam",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Mīāndoāb",
    country: "IR",
    timezone: "Asia/Tehran",
  },
  {
    name: "Cagliari",
    country: "IT",
    timezone: "Europe/Rome",
  },
  {
    name: "Vicenza",
    country: "IT",
    timezone: "Europe/Rome",
  },
  {
    name: "Prato",
    country: "IT",
    timezone: "Europe/Rome",
  },
  {
    name: "Piacenza",
    country: "IT",
    timezone: "Europe/Rome",
  },
  {
    name: "Padova",
    country: "IT",
    timezone: "Europe/Rome",
  },
  {
    name: "Irbid",
    country: "JO",
    timezone: "Asia/Amman",
  },
  {
    name: "Toyonaka",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Ōmuta",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Utrecht",
    country: "NL",
    timezone: "Europe/Amsterdam",
  },
  {
    name: "'s-Hertogenbosch",
    country: "NL",
    timezone: "Europe/Amsterdam",
  },
  {
    name: "Hoofddorp",
    country: "NL",
    timezone: "Europe/Amsterdam",
  },
  {
    name: "Bawshar",
    country: "OM",
    timezone: "Asia/Muscat",
  },
  {
    name: "Chimbote",
    country: "PE",
    timezone: "America/Lima",
  },
  {
    name: "Santiago de Surco",
    country: "PE",
    timezone: "America/Lima",
  },
  {
    name: "Cusco",
    country: "PE",
    timezone: "America/Lima",
  },
  {
    name: "Naga",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Meycauayan",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Muzaffarābād",
    country: "PK",
    timezone: "Asia/Karachi",
  },
  {
    name: "Kotli",
    country: "PK",
    timezone: "Asia/Karachi",
  },
  {
    name: "Rybinsk",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Pyatigorsk",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Oktyabrsky",
    country: "RU",
    timezone: "Asia/Yekaterinburg",
  },
  {
    name: "Novyye Kuz’minki",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Noginsk",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Magnitogorsk",
    country: "RU",
    timezone: "Asia/Yekaterinburg",
  },
  {
    name: "Al’met’yevsk",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Yekaterinburg",
    country: "RU",
    timezone: "Asia/Yekaterinburg",
  },
  {
    name: "Rubtsovsk",
    country: "RU",
    timezone: "Asia/Barnaul",
  },
  {
    name: "Petrogradka",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Qurayyat",
    country: "SA",
    timezone: "Asia/Riyadh",
  },
  {
    name: "Al Kharj",
    country: "SA",
    timezone: "Asia/Riyadh",
  },
  {
    name: "Dammam",
    country: "SA",
    timezone: "Asia/Riyadh",
  },
  {
    name: "Abha",
    country: "SA",
    timezone: "Asia/Riyadh",
  },
  {
    name: "Košice",
    country: "SK",
    timezone: "Europe/Bratislava",
  },
  {
    name: "Dushanbe",
    country: "TJ",
    timezone: "Asia/Dushanbe",
  },
  {
    name: "Mary",
    country: "TM",
    timezone: "Asia/Ashgabat",
  },
  {
    name: "Kızıltepe",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Gaziantep",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Batikent",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Turhal",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Ataşehir",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Sultangazi",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Shulin",
    country: "TW",
    timezone: "Asia/Taipei",
  },
  {
    name: "Augsburg",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Tébessa",
    country: "DZ",
    timezone: "Africa/Algiers",
  },
  {
    name: "Khenchela",
    country: "DZ",
    timezone: "Africa/Algiers",
  },
  {
    name: "Guelma",
    country: "DZ",
    timezone: "Africa/Algiers",
  },
  {
    name: "Annaba",
    country: "DZ",
    timezone: "Africa/Algiers",
  },
  {
    name: "Loja",
    country: "EC",
    timezone: "America/Guayaquil",
  },
  {
    name: "Luxor",
    country: "EG",
    timezone: "Africa/Cairo",
  },
  {
    name: "Al Minyā",
    country: "EG",
    timezone: "Africa/Cairo",
  },
  {
    name: "Elche",
    country: "ES",
    timezone: "Europe/Madrid",
  },
  {
    name: "Castelló de la Plana",
    country: "ES",
    timezone: "Europe/Madrid",
  },
  {
    name: "Almería",
    country: "ES",
    timezone: "Europe/Madrid",
  },
  {
    name: "Moratalaz",
    country: "ES",
    timezone: "Europe/Madrid",
  },
  {
    name: "Sant Martí",
    country: "ES",
    timezone: "Europe/Madrid",
  },
  {
    name: "Dire Dawa",
    country: "ET",
    timezone: "Africa/Addis_Ababa",
  },
  {
    name: "Desē",
    country: "ET",
    timezone: "Africa/Addis_Ababa",
  },
  {
    name: "Reims",
    country: "FR",
    timezone: "Europe/Paris",
  },
  {
    name: "Clermont-Ferrand",
    country: "FR",
    timezone: "Europe/Paris",
  },
  {
    name: "West Bromwich",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Walthamstow",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Swindon",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Irákleion",
    country: "GR",
    timezone: "Europe/Athens",
  },
  {
    name: "Quetzaltenango",
    country: "GT",
    timezone: "America/Guatemala",
  },
  {
    name: "La Ceiba",
    country: "HN",
    timezone: "America/Tegucigalpa",
  },
  {
    name: "Léogâne",
    country: "HT",
    timezone: "America/Port-au-Prince",
  },
  {
    name: "Yogyakarta",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Makassar",
    country: "ID",
    timezone: "Asia/Makassar",
  },
  {
    name: "Sorong",
    country: "ID",
    timezone: "Asia/Jayapura",
  },
  {
    name: "Sidoarjo",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Purwokerto",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Parepare",
    country: "ID",
    timezone: "Asia/Makassar",
  },
  {
    name: "Kediri",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Potsdam",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Mainz",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Heilbronn",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Hamburg",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Slough",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Salford",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Bournemouth",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Canberra",
    country: "AU",
    timezone: "Australia/Sydney",
  },
  {
    name: "Iquique",
    country: "CL",
    timezone: "America/Santiago",
  },
  {
    name: "Chillán",
    country: "CL",
    timezone: "America/Santiago",
  },
  {
    name: "Jiuquan",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Zhuzhou",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Zhuji",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Yancheng",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Xining",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Tanggu",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Shantou",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Shangluo",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Putian",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Mentougou",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Majie",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Luzhou",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Luoyang",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Laohekou",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Lanzhou",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Jieshou",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Yiyang",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Hepo",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Chenzhou",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Baise",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Suzhou",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Shenyang",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Hulan Ergi",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Fuyu",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Daqing",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Uzhgorod",
    country: "UA",
    timezone: "Europe/Kyiv",
  },
  {
    name: "Khmelnytskyi",
    country: "UA",
    timezone: "Europe/Kyiv",
  },
  {
    name: "Lira",
    country: "UG",
    timezone: "Africa/Kampala",
  },
  {
    name: "Mobile",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "Fayetteville",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Manzanillo",
    country: "CU",
    timezone: "America/Havana",
  },
  {
    name: "Campina Grande",
    country: "BR",
    timezone: "America/Fortaleza",
  },
  {
    name: "Umuarama",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "São Leopoldo",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "São João de Meriti",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Nova Friburgo",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Jaraguá do Sul",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Brasília",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Araraquara",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Alagoinhas",
    country: "BR",
    timezone: "America/Bahia",
  },
  {
    name: "Planaltina",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Saskatoon",
    country: "CA",
    timezone: "America/Regina",
  },
  {
    name: "Trois-Rivières",
    country: "CA",
    timezone: "America/Toronto",
  },
  {
    name: "Bangui",
    country: "CF",
    timezone: "Africa/Bangui",
  },
  {
    name: "Sioux Falls",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "Bridgeport",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Scottsdale",
    country: "US",
    timezone: "America/Phoenix",
  },
  {
    name: "Riverside",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Nishinomiya-hama",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Maebashi",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Kamakura",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Ichihara",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Hachinohe",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Aomori",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Limuru",
    country: "KE",
    timezone: "Africa/Nairobi",
  },
  {
    name: "Osh",
    country: "KG",
    timezone: "Asia/Bishkek",
  },
  {
    name: "Bishkek",
    country: "KG",
    timezone: "Asia/Bishkek",
  },
  {
    name: "Manp’o",
    country: "KP",
    timezone: "Asia/Pyongyang",
  },
  {
    name: "Suncheon",
    country: "KR",
    timezone: "Asia/Seoul",
  },
  {
    name: "Gunsan",
    country: "KR",
    timezone: "Asia/Seoul",
  },
  {
    name: "Petropavl",
    country: "KZ",
    timezone: "Asia/Almaty",
  },
  {
    name: "Vacoas",
    country: "MU",
    timezone: "Indian/Mauritius",
  },
  {
    name: "Provo",
    country: "US",
    timezone: "America/Denver",
  },
  {
    name: "Ocumare del Tuy",
    country: "VE",
    timezone: "America/Caracas",
  },
  {
    name: "Araure",
    country: "VE",
    timezone: "America/Caracas",
  },
  {
    name: "Hòa Bình",
    country: "VN",
    timezone: "Asia/Bangkok",
  },
  {
    name: "Bảo Lộc",
    country: "VN",
    timezone: "Asia/Ho_Chi_Minh",
  },
  {
    name: "Taganskiy",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Chinandega",
    country: "NI",
    timezone: "America/Managua",
  },
  {
    name: "Groningen",
    country: "NL",
    timezone: "Europe/Amsterdam",
  },
  {
    name: "Pagadian",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Olongapo",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Lapu-Lapu City",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Imus",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Baliuag",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Sahiwal",
    country: "PK",
    timezone: "Asia/Karachi",
  },
  {
    name: "Okara",
    country: "PK",
    timezone: "Asia/Karachi",
  },
  {
    name: "Jhelum",
    country: "PK",
    timezone: "Asia/Karachi",
  },
  {
    name: "Faisalabad",
    country: "PK",
    timezone: "Asia/Karachi",
  },
  {
    name: "Bari",
    country: "IT",
    timezone: "Europe/Rome",
  },
  {
    name: "Kyoto",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Isehara",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Ise",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Ikoma",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Wakayama",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Hanam",
    country: "KR",
    timezone: "Asia/Seoul",
  },
  {
    name: "Sejong",
    country: "KR",
    timezone: "Asia/Seoul",
  },
  {
    name: "Ust-Kamenogorsk",
    country: "KZ",
    timezone: "Asia/Almaty",
  },
  {
    name: "Zliten",
    country: "LY",
    timezone: "Africa/Tripoli",
  },
  {
    name: "Temara",
    country: "MA",
    timezone: "Africa/Casablanca",
  },
  {
    name: "Fès al Bali",
    country: "MA",
    timezone: "Africa/Casablanca",
  },
  {
    name: "Mopti",
    country: "ML",
    timezone: "Africa/Bamako",
  },
  {
    name: "Yenangyaung",
    country: "MM",
    timezone: "Asia/Yangon",
  },
  {
    name: "Ciudad Valles",
    country: "MX",
    timezone: "America/Mexico_City",
  },
  {
    name: "Tulancingo",
    country: "MX",
    timezone: "America/Mexico_City",
  },
  {
    name: "Tlalnepantla",
    country: "MX",
    timezone: "America/Mexico_City",
  },
  {
    name: "Cuautitlán Izcalli",
    country: "MX",
    timezone: "America/Mexico_City",
  },
  {
    name: "Piedras Negras",
    country: "MX",
    timezone: "America/Matamoros",
  },
  {
    name: "Quelimane",
    country: "MZ",
    timezone: "Africa/Maputo",
  },
  {
    name: "Port Harcourt",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Ilobu",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Ilesa",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Gbongan",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Taizhou",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Pailou",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Jinzhong",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Tumxuk",
    country: "CN",
    timezone: "Asia/Urumqi",
  },
  {
    name: "Shizuishan",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Hospet",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Haridwar",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Haldwani",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Gudivāda",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Chūru",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Chānda",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Bilāspur",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Bārsi",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Quthbullapur",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Ramadi",
    country: "IQ",
    timezone: "Asia/Baghdad",
  },
  {
    name: "Abū Ghurayb",
    country: "IQ",
    timezone: "Asia/Baghdad",
  },
  {
    name: "Mahābād",
    country: "IR",
    timezone: "Asia/Tehran",
  },
  {
    name: "Karaj",
    country: "IR",
    timezone: "Asia/Tehran",
  },
  {
    name: "Udine",
    country: "IT",
    timezone: "Europe/Rome",
  },
  {
    name: "Taranto",
    country: "IT",
    timezone: "Europe/Rome",
  },
  {
    name: "Ashdod",
    country: "IL",
    timezone: "Asia/Jerusalem",
  },
  {
    name: "West Jerusalem",
    country: "IL",
    timezone: "Asia/Jerusalem",
  },
  {
    name: "Wardha",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Thiruvananthapuram",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Srikakulam",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Sambhal",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Rāmgundam",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Madurai",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Latur",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Makhachkala",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Lyubertsy",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Bataysk",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Nizhnevartovsk",
    country: "RU",
    timezone: "Asia/Yekaterinburg",
  },
  {
    name: "Kansk",
    country: "RU",
    timezone: "Asia/Krasnoyarsk",
  },
  {
    name: "Chertanovo Yuzhnoye",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "El Daein",
    country: "SD",
    timezone: "Africa/Khartoum",
  },
  {
    name: "Sollentuna",
    country: "SE",
    timezone: "Europe/Stockholm",
  },
  {
    name: "Örebro",
    country: "SE",
    timezone: "Europe/Stockholm",
  },
  {
    name: "Pikine",
    country: "SN",
    timezone: "Africa/Dakar",
  },
  {
    name: "Kaolack",
    country: "SN",
    timezone: "Africa/Dakar",
  },
  {
    name: "Dakar",
    country: "SN",
    timezone: "Africa/Dakar",
  },
  {
    name: "Santa Ana",
    country: "SV",
    timezone: "America/El_Salvador",
  },
  {
    name: "Bandırma",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Büyükçekmece",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Zanzibar",
    country: "TZ",
    timezone: "Africa/Dar_es_Salaam",
  },
  {
    name: "Toledo",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Milwaukee",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "Chinatown",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Fremont",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Koreatown",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Modesto",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Vallejo",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Aurora",
    country: "US",
    timezone: "America/Denver",
  },
  {
    name: "Tirmiz",
    country: "UZ",
    timezone: "Asia/Samarkand",
  },
  {
    name: "Jizzax",
    country: "UZ",
    timezone: "Asia/Samarkand",
  },
  {
    name: "Puerto Ayacucho",
    country: "VE",
    timezone: "America/Caracas",
  },
  {
    name: "Cabudare",
    country: "VE",
    timezone: "America/Caracas",
  },
  {
    name: "Thái Nguyên",
    country: "VN",
    timezone: "Asia/Bangkok",
  },
  {
    name: "Qui Nhon",
    country: "VN",
    timezone: "Asia/Ho_Chi_Minh",
  },
  {
    name: "Hạ Long",
    country: "VN",
    timezone: "Asia/Bangkok",
  },
  {
    name: "Gdynia",
    country: "PL",
    timezone: "Europe/Warsaw",
  },
  {
    name: "Sector 3",
    country: "RO",
    timezone: "Europe/Bucharest",
  },
  {
    name: "Kampala",
    country: "UG",
    timezone: "Africa/Kampala",
  },
  {
    name: "Washington",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Savannah",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Lexington-Fayette",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Meads",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Greensboro",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Abilene",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "Beaumont",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "Brownsville",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "Plano",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "Chicago",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "Joliet",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "Ras Al Khaimah City",
    country: "AE",
    timezone: "Asia/Dubai",
  },
  {
    name: "Ghazni",
    country: "AF",
    timezone: "Asia/Kabul",
  },
  {
    name: "José C. Paz",
    country: "AR",
    timezone: "America/Argentina/Buenos_Aires",
  },
  {
    name: "Graz",
    country: "AT",
    timezone: "Europe/Vienna",
  },
  {
    name: "Brakpan",
    country: "ZA",
    timezone: "Africa/Johannesburg",
  },
  {
    name: "Bloemfontein",
    country: "ZA",
    timezone: "Africa/Johannesburg",
  },
  {
    name: "Mutare",
    country: "ZW",
    timezone: "Africa/Harare",
  },
  {
    name: "Aachen",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Mitte",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Ḩalwān",
    country: "EG",
    timezone: "Africa/Cairo",
  },
  {
    name: "Damanhūr",
    country: "EG",
    timezone: "Africa/Cairo",
  },
  {
    name: "Būsh",
    country: "EG",
    timezone: "Africa/Cairo",
  },
  {
    name: "La Laguna",
    country: "ES",
    timezone: "Atlantic/Canary",
  },
  {
    name: "Granada",
    country: "ES",
    timezone: "Europe/Madrid",
  },
  {
    name: "Torrejón de Ardoz",
    country: "ES",
    timezone: "Europe/Madrid",
  },
  {
    name: "L'Hospitalet de Llobregat",
    country: "ES",
    timezone: "Europe/Madrid",
  },
  {
    name: "Alcorcón",
    country: "ES",
    timezone: "Europe/Madrid",
  },
  {
    name: "Moncloa-Aravaca",
    country: "ES",
    timezone: "Europe/Madrid",
  },
  {
    name: "Eixample",
    country: "ES",
    timezone: "Europe/Madrid",
  },
  {
    name: "Fuencarral-El Pardo",
    country: "ES",
    timezone: "Europe/Madrid",
  },
  {
    name: "Nazrēt",
    country: "ET",
    timezone: "Africa/Addis_Ababa",
  },
  {
    name: "Jimma",
    country: "ET",
    timezone: "Africa/Addis_Ababa",
  },
  {
    name: "Antwerpen",
    country: "BE",
    timezone: "Europe/Brussels",
  },
  {
    name: "Parakou",
    country: "BJ",
    timezone: "Africa/Porto-Novo",
  },
  {
    name: "Fortaleza",
    country: "BR",
    timezone: "America/Fortaleza",
  },
  {
    name: "Santos",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Patos de Minas",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Mairiporã",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Foz do Iguaçu",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Cachoeiro de Itapemirim",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Rio Branco",
    country: "BR",
    timezone: "America/Rio_Branco",
  },
  {
    name: "Regina",
    country: "CA",
    timezone: "America/Regina",
  },
  {
    name: "York",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Zoucheng",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Zhoucun",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Yangshuo",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Taishan",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Suizhou",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Songcheng",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Jinjiang",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Puyang",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Jingmen",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Huicheng",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Huangshi",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Huaibei",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Hebi",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Benxi",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Acheng",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Banja Luka",
    country: "BA",
    timezone: "Europe/Sarajevo",
  },
  {
    name: "Tāngāil",
    country: "BD",
    timezone: "Asia/Dhaka",
  },
  {
    name: "Northampton",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Dudley",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Croydon",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Crawley",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Kamsar",
    country: "GN",
    timezone: "Africa/Conakry",
  },
  {
    name: "Nzérékoré",
    country: "GN",
    timezone: "Africa/Conakry",
  },
  {
    name: "Hagen",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Jutiapa",
    country: "GT",
    timezone: "America/Guatemala",
  },
  {
    name: "Yuen Long Kau Hui",
    country: "HK",
    timezone: "Asia/Hong_Kong",
  },
  {
    name: "Tsing Yi Town",
    country: "HK",
    timezone: "Asia/Hong_Kong",
  },
  {
    name: "Delmas 73",
    country: "HT",
    timezone: "America/Port-au-Prince",
  },
  {
    name: "Les Cayes",
    country: "HT",
    timezone: "America/Port-au-Prince",
  },
  {
    name: "Sukabumi",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Plumbon",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Pati",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Pasarkemis",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Mataram",
    country: "ID",
    timezone: "Asia/Makassar",
  },
  {
    name: "Manokwari",
    country: "ID",
    timezone: "Asia/Jayapura",
  },
  {
    name: "Madiun",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Lawang",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Grogol",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Depok",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Citeureup",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Cianjur",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Kuopio",
    country: "FI",
    timezone: "Europe/Helsinki",
  },
  {
    name: "Dharān",
    country: "NP",
    timezone: "Asia/Kathmandu",
  },
  {
    name: "Dunedin",
    country: "NZ",
    timezone: "Pacific/Auckland",
  },
  {
    name: "Tauranga",
    country: "NZ",
    timezone: "Pacific/Auckland",
  },
  {
    name: "Ayacucho",
    country: "PE",
    timezone: "America/Lima",
  },
  {
    name: "San Francisco De Borja",
    country: "PE",
    timezone: "America/Lima",
  },
  {
    name: "Zamboanga",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Koronadal",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Hagonoy",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Guyong",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Batangas",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Pasig City",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Tarnów",
    country: "PL",
    timezone: "Europe/Warsaw",
  },
  {
    name: "Smolensk",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Pushkino",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Nizhnekamsk",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Miass",
    country: "RU",
    timezone: "Asia/Yekaterinburg",
  },
  {
    name: "Abakan",
    country: "RU",
    timezone: "Asia/Krasnoyarsk",
  },
  {
    name: "Komsomolsk-on-Amur",
    country: "RU",
    timezone: "Asia/Vladivostok",
  },
  {
    name: "Nyala",
    country: "SD",
    timezone: "Africa/Khartoum",
  },
  {
    name: "Geneina",
    country: "SD",
    timezone: "Africa/Khartoum",
  },
  {
    name: "Uppsala",
    country: "SE",
    timezone: "Europe/Stockholm",
  },
  {
    name: "Baidoa",
    country: "SO",
    timezone: "Africa/Mogadishu",
  },
  {
    name: "Malakal",
    country: "SS",
    timezone: "Africa/Juba",
  },
  {
    name: "Al Bāb",
    country: "SY",
    timezone: "Asia/Damascus",
  },
  {
    name: "Chiang Mai",
    country: "TH",
    timezone: "Asia/Bangkok",
  },
  {
    name: "Ubon Ratchathani",
    country: "TH",
    timezone: "Asia/Bangkok",
  },
  {
    name: "Khujand",
    country: "TJ",
    timezone: "Asia/Dushanbe",
  },
  {
    name: "Turgutlu",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Eskişehir",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Antalya",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Merkezefendi",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Neihu",
    country: "TW",
    timezone: "Asia/Taipei",
  },
  {
    name: "Dąbrowa Górnicza",
    country: "PL",
    timezone: "Europe/Warsaw",
  },
  {
    name: "Bielsko-Biala",
    country: "PL",
    timezone: "Europe/Warsaw",
  },
  {
    name: "Craiova",
    country: "RO",
    timezone: "Europe/Bucharest",
  },
  {
    name: "Bucharest",
    country: "RO",
    timezone: "Europe/Bucharest",
  },
  {
    name: "Brăila",
    country: "RO",
    timezone: "Europe/Bucharest",
  },
  {
    name: "Botoşani",
    country: "RO",
    timezone: "Europe/Bucharest",
  },
  {
    name: "Tapachula",
    country: "MX",
    timezone: "America/Mexico_City",
  },
  {
    name: "Coyoacán",
    country: "MX",
    timezone: "America/Mexico_City",
  },
  {
    name: "Ciudad Victoria",
    country: "MX",
    timezone: "America/Monterrey",
  },
  {
    name: "Zamora",
    country: "MX",
    timezone: "America/Mexico_City",
  },
  {
    name: "Ciudad de Villa de Álvarez",
    country: "MX",
    timezone: "America/Mexico_City",
  },
  {
    name: "Tasek Glugor",
    country: "MY",
    timezone: "Asia/Kuala_Lumpur",
  },
  {
    name: "Sungai Petani",
    country: "MY",
    timezone: "Asia/Kuala_Lumpur",
  },
  {
    name: "Oyo",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Azare",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Akure",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Dnipro",
    country: "UA",
    timezone: "Europe/Kyiv",
  },
  {
    name: "Little Rock",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "Hialeah",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Orlando",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "New Orleans",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "Columbia",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "West Raleigh",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Grand Prairie",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "McAllen",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "Anaheim",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Huntington Beach",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Victorville",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "El Paso",
    country: "US",
    timezone: "America/Denver",
  },
  {
    name: "Renton",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Fergana",
    country: "UZ",
    timezone: "Asia/Tashkent",
  },
  {
    name: "Baruta",
    country: "VE",
    timezone: "America/Caracas",
  },
  {
    name: "Phan Thiết",
    country: "VN",
    timezone: "Asia/Ho_Chi_Minh",
  },
  {
    name: "Bình Thủy",
    country: "VN",
    timezone: "Asia/Ho_Chi_Minh",
  },
  {
    name: "Vanderbijlpark",
    country: "ZA",
    timezone: "Africa/Johannesburg",
  },
  {
    name: "Potchefstroom",
    country: "ZA",
    timezone: "Africa/Johannesburg",
  },
  {
    name: "Gweru",
    country: "ZW",
    timezone: "Africa/Harare",
  },
  {
    name: "Rizhao",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Fangchenggang",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Qingyang",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Mianzhu, Deyang, Sichuan",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Soacha",
    country: "CO",
    timezone: "America/Bogota",
  },
  {
    name: "Malambo",
    country: "CO",
    timezone: "America/Bogota",
  },
  {
    name: "Girardot City",
    country: "CO",
    timezone: "America/Bogota",
  },
  {
    name: "Las Tunas",
    country: "CU",
    timezone: "America/Havana",
  },
  {
    name: "Centro Habana",
    country: "CU",
    timezone: "America/Havana",
  },
  {
    name: "Santo Domingo Este",
    country: "DO",
    timezone: "America/Santo_Domingo",
  },
  {
    name: "Souk Ahras",
    country: "DZ",
    timezone: "Africa/Algiers",
  },
  {
    name: "Manfalūţ",
    country: "EG",
    timezone: "Africa/Cairo",
  },
  {
    name: "Al Khuşūş",
    country: "EG",
    timezone: "Africa/Cairo",
  },
  {
    name: "Al Fayyūm",
    country: "EG",
    timezone: "Africa/Cairo",
  },
  {
    name: "Tarragona",
    country: "ES",
    timezone: "Europe/Madrid",
  },
  {
    name: "Ciudad Lineal",
    country: "ES",
    timezone: "Europe/Madrid",
  },
  {
    name: "Nou Barris",
    country: "ES",
    timezone: "Europe/Madrid",
  },
  {
    name: "Perpignan",
    country: "FR",
    timezone: "Europe/Paris",
  },
  {
    name: "Wakefield",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Sutton",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Maracanaú",
    country: "BR",
    timezone: "America/Fortaleza",
  },
  {
    name: "Maceió",
    country: "BR",
    timezone: "America/Maceio",
  },
  {
    name: "João Pessoa",
    country: "BR",
    timezone: "America/Fortaleza",
  },
  {
    name: "Nossa Senhora do Socorro",
    country: "BR",
    timezone: "America/Maceio",
  },
  {
    name: "Itanhaém",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Gravataí",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Eunápolis",
    country: "BR",
    timezone: "America/Bahia",
  },
  {
    name: "Carapicuíba",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Campos dos Goytacazes",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Guaíba",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Palmas",
    country: "BR",
    timezone: "America/Araguaina",
  },
  {
    name: "Orsha",
    country: "BY",
    timezone: "Europe/Minsk",
  },
  {
    name: "Delta",
    country: "CA",
    timezone: "America/Vancouver",
  },
  {
    name: "Greater Sudbury",
    country: "CA",
    timezone: "America/Toronto",
  },
  {
    name: "Markham",
    country: "CA",
    timezone: "America/Toronto",
  },
  {
    name: "Lévis",
    country: "CA",
    timezone: "America/Toronto",
  },
  {
    name: "Uvira",
    country: "CD",
    timezone: "Africa/Lubumbashi",
  },
  {
    name: "Calama",
    country: "CL",
    timezone: "America/Santiago",
  },
  {
    name: "Ngaoundéré",
    country: "CM",
    timezone: "Africa/Douala",
  },
  {
    name: "Shangqiu",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Zhangye",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Xuanzhou",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Xinyu",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Xinxiang",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Ankang",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Wuhu",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Wuhan",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Huai'an",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Nanchang",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Luancheng",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Liuzhou",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Leiyang",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Guangyuan",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Hengshui",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Jiaojiang",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Danshui",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Chenghua",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Bijie",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Bashan",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Zhoushan",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Ulanhot",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Shanhaiguan",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Longfeng",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Hegang",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Chaoyang",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "E’zhou",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Portmore",
    country: "JM",
    timezone: "America/Jamaica",
  },
  {
    name: "Yamaguchi",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Seto",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Sandachō",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Malindi",
    country: "KE",
    timezone: "Africa/Nairobi",
  },
  {
    name: "Songnim-ni",
    country: "KP",
    timezone: "Asia/Pyongyang",
  },
  {
    name: "Kaesŏng",
    country: "KP",
    timezone: "Asia/Pyongyang",
  },
  {
    name: "Gwangju",
    country: "KR",
    timezone: "Asia/Seoul",
  },
  {
    name: "Chinju",
    country: "KR",
    timezone: "Asia/Seoul",
  },
  {
    name: "Ansan-si",
    country: "KR",
    timezone: "Asia/Seoul",
  },
  {
    name: "Karagandy",
    country: "KZ",
    timezone: "Asia/Almaty",
  },
  {
    name: "Casablanca",
    country: "MA",
    timezone: "Africa/Casablanca",
  },
  {
    name: "Mahajanga",
    country: "MG",
    timezone: "Indian/Antananarivo",
  },
  {
    name: "Taunggyi",
    country: "MM",
    timezone: "Asia/Yangon",
  },
  {
    name: "Hinthada",
    country: "MM",
    timezone: "Asia/Yangon",
  },
  {
    name: "Tirupati",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Pathānkot",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Jabalpur",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Hoshiārpur",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Fatehpur",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Dhaulpur",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Chās",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Bilimora",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Anand",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Ambattūr",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Gadag-Betageri",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Masjed Soleymān",
    country: "IR",
    timezone: "Asia/Tehran",
  },
  {
    name: "Marand",
    country: "IR",
    timezone: "Asia/Tehran",
  },
  {
    name: "Pescara",
    country: "IT",
    timezone: "Europe/Rome",
  },
  {
    name: "London",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Lincoln",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Aberdeen",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Kutaisi",
    country: "GE",
    timezone: "Asia/Tbilisi",
  },
  {
    name: "Accra",
    country: "GH",
    timezone: "Africa/Accra",
  },
  {
    name: "Singosari",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Parung",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Magelang",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Bogor",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Batu",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Sarajevo",
    country: "BA",
    timezone: "Europe/Sarajevo",
  },
  {
    name: "Sātkhira",
    country: "BD",
    timezone: "Asia/Dhaka",
  },
  {
    name: "Nāgarpur",
    country: "BD",
    timezone: "Asia/Dhaka",
  },
  {
    name: "Elbasan",
    country: "AL",
    timezone: "Europe/Tirane",
  },
  {
    name: "Resistencia",
    country: "AR",
    timezone: "America/Argentina/Cordoba",
  },
  {
    name: "La Rioja",
    country: "AR",
    timezone: "America/Argentina/La_Rioja",
  },
  {
    name: "Nevinnomyssk",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Neftekamsk",
    country: "RU",
    timezone: "Asia/Yekaterinburg",
  },
  {
    name: "Khimki",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Khanty-Mansiysk",
    country: "RU",
    timezone: "Asia/Yekaterinburg",
  },
  {
    name: "Chelyabinsk",
    country: "RU",
    timezone: "Asia/Yekaterinburg",
  },
  {
    name: "Yanbu",
    country: "SA",
    timezone: "Asia/Riyadh",
  },
  {
    name: "Linköping",
    country: "SE",
    timezone: "Europe/Stockholm",
  },
  {
    name: "Deir ez-Zor",
    country: "SY",
    timezone: "Asia/Damascus",
  },
  {
    name: "Si Racha",
    country: "TH",
    timezone: "Asia/Bangkok",
  },
  {
    name: "Şanlıurfa",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Iğdır",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Aksaray",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Üsküdar",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Tokat",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Bağcılar",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Başakşehir",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Muratpaşa",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Mbeya",
    country: "TZ",
    timezone: "Africa/Dar_es_Salaam",
  },
  {
    name: "Vinnytsya",
    country: "UA",
    timezone: "Europe/Kyiv",
  },
  {
    name: "Miramar",
    country: "MX",
    timezone: "America/Monterrey",
  },
  {
    name: "Xalapa de Enríquez",
    country: "MX",
    timezone: "America/Mexico_City",
  },
  {
    name: "Delegación Cuajimalpa de Morelos",
    country: "MX",
    timezone: "America/Mexico_City",
  },
  {
    name: "Coatzacoalcos",
    country: "MX",
    timezone: "America/Mexico_City",
  },
  {
    name: "Mexico City",
    country: "MX",
    timezone: "America/Mexico_City",
  },
  {
    name: "Tonalá",
    country: "MX",
    timezone: "America/Mexico_City",
  },
  {
    name: "Navojoa",
    country: "MX",
    timezone: "America/Hermosillo",
  },
  {
    name: "León de los Aldama",
    country: "MX",
    timezone: "America/Mexico_City",
  },
  {
    name: "Lahad Datu",
    country: "MY",
    timezone: "Asia/Kuching",
  },
  {
    name: "Bukit Mertajam",
    country: "MY",
    timezone: "Asia/Kuala_Lumpur",
  },
  {
    name: "Sibu",
    country: "MY",
    timezone: "Asia/Kuching",
  },
  {
    name: "Miri",
    country: "MY",
    timezone: "Asia/Kuching",
  },
  {
    name: "Maxixe",
    country: "MZ",
    timezone: "Africa/Maputo",
  },
  {
    name: "Chimoio",
    country: "MZ",
    timezone: "Africa/Maputo",
  },
  {
    name: "Sapele",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Osogbo",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Lublin",
    country: "PL",
    timezone: "Europe/Warsaw",
  },
  {
    name: "Toruń",
    country: "PL",
    timezone: "Europe/Warsaw",
  },
  {
    name: "Gorzów Wielkopolski",
    country: "PL",
    timezone: "Europe/Warsaw",
  },
  {
    name: "Sector 2",
    country: "RO",
    timezone: "Europe/Bucharest",
  },
  {
    name: "Rotterdam",
    country: "NL",
    timezone: "Europe/Amsterdam",
  },
  {
    name: "Dhangaḍhi̇̄",
    country: "NP",
    timezone: "Asia/Kathmandu",
  },
  {
    name: "Christchurch",
    country: "NZ",
    timezone: "Pacific/Auckland",
  },
  {
    name: "As Suwayq",
    country: "OM",
    timezone: "Asia/Muscat",
  },
  {
    name: "Lima",
    country: "PE",
    timezone: "America/Lima",
  },
  {
    name: "Tuguegarao",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Santa Cruz",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Quezon City",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Mansilingan",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Binangonan",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Tampa",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Metairie Terrace",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "Tulsa",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "Jhang Sadr",
    country: "PK",
    timezone: "Asia/Karachi",
  },
  {
    name: "Takamatsu",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Nobeoka",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Kazo",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Kasukabe",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Anjō",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Morioka",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Tomakomai",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Fès",
    country: "MA",
    timezone: "Africa/Casablanca",
  },
  {
    name: "Salé Al Jadida",
    country: "MA",
    timezone: "Africa/Casablanca",
  },
  {
    name: "Aïn Oussera",
    country: "DZ",
    timezone: "Africa/Algiers",
  },
  {
    name: "Quito",
    country: "EC",
    timezone: "America/Guayaquil",
  },
  {
    name: "Zefta",
    country: "EG",
    timezone: "Africa/Cairo",
  },
  {
    name: "Ţanţā",
    country: "EG",
    timezone: "Africa/Cairo",
  },
  {
    name: "Shubrā al Khaymah",
    country: "EG",
    timezone: "Africa/Cairo",
  },
  {
    name: "Cairo",
    country: "EG",
    timezone: "Africa/Cairo",
  },
  {
    name: "Al Maḩallah al Kubrá",
    country: "EG",
    timezone: "Africa/Cairo",
  },
  {
    name: "Al Fashn",
    country: "EG",
    timezone: "Africa/Cairo",
  },
  {
    name: "Alicante",
    country: "ES",
    timezone: "Europe/Madrid",
  },
  {
    name: "Santa Coloma de Gramenet",
    country: "ES",
    timezone: "Europe/Madrid",
  },
  {
    name: "Gondar",
    country: "ET",
    timezone: "Africa/Addis_Ababa",
  },
  {
    name: "Bahir Dar",
    country: "ET",
    timezone: "Africa/Addis_Ababa",
  },
  {
    name: "Hawassa",
    country: "ET",
    timezone: "Africa/Addis_Ababa",
  },
  {
    name: "Nancy",
    country: "FR",
    timezone: "Europe/Paris",
  },
  {
    name: "Le Mans",
    country: "FR",
    timezone: "Europe/Paris",
  },
  {
    name: "Wolverhampton",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Surat",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Seoni",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Rajapalaiyam",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Parbhani",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Nellore",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Murwāra",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Medinīpur",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Mormugao",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Krishnanagar",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Jodhpur",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Chanduasi",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Bīkaner",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Bānsbāria",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Panchkula",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Zanjān",
    country: "IR",
    timezone: "Asia/Tehran",
  },
  {
    name: "Varāmīn",
    country: "IR",
    timezone: "Asia/Tehran",
  },
  {
    name: "Sari",
    country: "IR",
    timezone: "Asia/Tehran",
  },
  {
    name: "Bandar Abbas",
    country: "IR",
    timezone: "Asia/Tehran",
  },
  {
    name: "Āmol",
    country: "IR",
    timezone: "Asia/Tehran",
  },
  {
    name: "Zābol",
    country: "IR",
    timezone: "Asia/Tehran",
  },
  {
    name: "Perugia",
    country: "IT",
    timezone: "Europe/Rome",
  },
  {
    name: "Foggia",
    country: "IT",
    timezone: "Europe/Rome",
  },
  {
    name: "Port-au-Prince",
    country: "HT",
    timezone: "America/Port-au-Prince",
  },
  {
    name: "Payakumbuh",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Pasuruan",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Depok",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Dundee",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Birmingham",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Basildon",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Espoo",
    country: "FI",
    timezone: "Europe/Helsinki",
  },
  {
    name: "Minneapolis",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "New York City",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Deer Valley",
    country: "US",
    timezone: "America/Phoenix",
  },
  {
    name: "Daly City",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Santa Maria",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Odessa",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "Hillsboro",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Portland",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Anaco",
    country: "VE",
    timezone: "America/Caracas",
  },
  {
    name: "Punta Cardón",
    country: "VE",
    timezone: "America/Caracas",
  },
  {
    name: "Petare",
    country: "VE",
    timezone: "America/Caracas",
  },
  {
    name: "La Victoria",
    country: "VE",
    timezone: "America/Caracas",
  },
  {
    name: "Calabozo",
    country: "VE",
    timezone: "America/Caracas",
  },
  {
    name: "Long Xuyên",
    country: "VN",
    timezone: "Asia/Ho_Chi_Minh",
  },
  {
    name: "Vryheid",
    country: "ZA",
    timezone: "Africa/Johannesburg",
  },
  {
    name: "Springs",
    country: "ZA",
    timezone: "Africa/Johannesburg",
  },
  {
    name: "Bulawayo",
    country: "ZW",
    timezone: "Africa/Harare",
  },
  {
    name: "Shangri-La",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Jianshui",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Yidu",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Riohacha",
    country: "CO",
    timezone: "America/Bogota",
  },
  {
    name: "Bogotá",
    country: "CO",
    timezone: "America/Bogota",
  },
  {
    name: "Bello",
    country: "CO",
    timezone: "America/Bogota",
  },
  {
    name: "Santiago de Cuba",
    country: "CU",
    timezone: "America/Havana",
  },
  {
    name: "Petrolina",
    country: "BR",
    timezone: "America/Recife",
  },
  {
    name: "Imperatriz",
    country: "BR",
    timezone: "America/Fortaleza",
  },
  {
    name: "Castanhal",
    country: "BR",
    timezone: "America/Belem",
  },
  {
    name: "Uruguaiana",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Niterói",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Lages",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Jundiaí",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Francisco Morato",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Barretos",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Salihorsk",
    country: "BY",
    timezone: "Europe/Minsk",
  },
  {
    name: "Homyel'",
    country: "BY",
    timezone: "Europe/Minsk",
  },
  {
    name: "Vaughan",
    country: "CA",
    timezone: "America/Toronto",
  },
  {
    name: "Winnipeg",
    country: "CA",
    timezone: "America/Winnipeg",
  },
  {
    name: "Maroua",
    country: "CM",
    timezone: "Africa/Douala",
  },
  {
    name: "Turpan",
    country: "CN",
    timezone: "Asia/Urumqi",
  },
  {
    name: "Yichun",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Taiyuan",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Suining",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Shaowu",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Wuchuan",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Guankou",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Langfang",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Jinan",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Guli",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Guigang",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Dingzhou",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Dalian",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Chongqing",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Bozhou",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Anqiu",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Anliu",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Longjiang",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Longshan",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Hailun",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Berazategui",
    country: "AR",
    timezone: "America/Argentina/Buenos_Aires",
  },
  {
    name: "Paraná",
    country: "AR",
    timezone: "America/Argentina/Cordoba",
  },
  {
    name: "Bahía Blanca",
    country: "AR",
    timezone: "America/Argentina/Buenos_Aires",
  },
  {
    name: "Wandsbek",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Göttingen",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Dresden",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Nippes",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Neukölln",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Nianbo",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Amherst",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Borough Park",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Harlem",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Akron",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Tucson",
    country: "US",
    timezone: "America/Phoenix",
  },
  {
    name: "Chico",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "East Los Angeles",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "San Bernardino",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Stockton",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Denver",
    country: "US",
    timezone: "America/Denver",
  },
  {
    name: "North Las Vegas",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Lubbock",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "Eugene",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Everett",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Qarshi",
    country: "UZ",
    timezone: "Asia/Samarkand",
  },
  {
    name: "Valera",
    country: "VE",
    timezone: "America/Caracas",
  },
  {
    name: "Cần Thơ",
    country: "VN",
    timezone: "Asia/Ho_Chi_Minh",
  },
  {
    name: "Pskov",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Odintsovo",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Novyye Cherëmushki",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Mytishchi",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Kolpino",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Khoroshëvo-Mnevniki",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Omsk",
    country: "RU",
    timezone: "Asia/Omsk",
  },
  {
    name: "Hafar Al-Batin",
    country: "SA",
    timezone: "Asia/Riyadh",
  },
  {
    name: "Ta’if",
    country: "SA",
    timezone: "Asia/Riyadh",
  },
  {
    name: "Rabak",
    country: "SD",
    timezone: "Africa/Khartoum",
  },
  {
    name: "Al Manāqil",
    country: "SD",
    timezone: "Africa/Khartoum",
  },
  {
    name: "Stockholm",
    country: "SE",
    timezone: "Europe/Stockholm",
  },
  {
    name: "Woodlands",
    country: "SG",
    timezone: "Asia/Singapore",
  },
  {
    name: "Wau",
    country: "SS",
    timezone: "Africa/Juba",
  },
  {
    name: "Idlib",
    country: "SY",
    timezone: "Asia/Damascus",
  },
  {
    name: "Sarh",
    country: "TD",
    timezone: "Africa/Ndjamena",
  },
  {
    name: "Phra Pradaeng",
    country: "TH",
    timezone: "Asia/Bangkok",
  },
  {
    name: "Hat Yai",
    country: "TH",
    timezone: "Asia/Bangkok",
  },
  {
    name: "Corpus Christi",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "Killeen",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "Newport News",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Osmaniye",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Ternopil",
    country: "UA",
    timezone: "Europe/Kyiv",
  },
  {
    name: "Tolyatti",
    country: "RU",
    timezone: "Europe/Samara",
  },
  {
    name: "Tarija",
    country: "BO",
    timezone: "America/La_Paz",
  },
  {
    name: "Mississauga",
    country: "CA",
    timezone: "America/Toronto",
  },
  {
    name: "Montréal",
    country: "CA",
    timezone: "America/Toronto",
  },
  {
    name: "Oshawa",
    country: "CA",
    timezone: "America/Toronto",
  },
  {
    name: "St. John's",
    country: "CA",
    timezone: "America/St_Johns",
  },
  {
    name: "Ilebo",
    country: "CD",
    timezone: "Africa/Lubumbashi",
  },
  {
    name: "Beni",
    country: "CD",
    timezone: "Africa/Lubumbashi",
  },
  {
    name: "Daloa",
    country: "CI",
    timezone: "Africa/Abidjan",
  },
  {
    name: "Punta Arenas",
    country: "CL",
    timezone: "America/Punta_Arenas",
  },
  {
    name: "Puente Alto",
    country: "CL",
    timezone: "America/Santiago",
  },
  {
    name: "Darmstadt",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Bielefeld",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Tizi Ouzou",
    country: "DZ",
    timezone: "Africa/Algiers",
  },
  {
    name: "Shibīn al Kawm",
    country: "EG",
    timezone: "Africa/Cairo",
  },
  {
    name: "Samālūţ",
    country: "EG",
    timezone: "Africa/Cairo",
  },
  {
    name: "Mersa Matruh",
    country: "EG",
    timezone: "Africa/Cairo",
  },
  {
    name: "As Sinbillāwayn",
    country: "EG",
    timezone: "Africa/Cairo",
  },
  {
    name: "Santa Cruz de Tenerife",
    country: "ES",
    timezone: "Atlantic/Canary",
  },
  {
    name: "Donostia / San Sebastián",
    country: "ES",
    timezone: "Europe/Madrid",
  },
  {
    name: "Usera",
    country: "ES",
    timezone: "Europe/Madrid",
  },
  {
    name: "Arba Minch",
    country: "ET",
    timezone: "Africa/Addis_Ababa",
  },
  {
    name: "Bole",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Palmira",
    country: "CO",
    timezone: "America/Bogota",
  },
  {
    name: "Medellín",
    country: "CO",
    timezone: "America/Bogota",
  },
  {
    name: "Barrancabermeja",
    country: "CO",
    timezone: "America/Bogota",
  },
  {
    name: "Port-Gentil",
    country: "GA",
    timezone: "Africa/Libreville",
  },
  {
    name: "City of Westminster",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Arica",
    country: "CL",
    timezone: "America/Santiago",
  },
  {
    name: "Lhasa",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Zhumadian",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Zhengzhou",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Ya'an",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Xianyang",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Weihai",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Pingdingshan",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Maba",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Jinchang",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Jiawang",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Hechuan",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Gejiu",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Dawukou",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Bengbu",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Shaoyang",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Jiangyou",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Zhangjiakou",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Liaoyang",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Jinzhou",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Heihe",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Didao",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Plymouth",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Mansfield",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Hastings",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Derby",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Bexley",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Magdeburg",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Kreuzberg",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Taiz",
    country: "YE",
    timezone: "Asia/Aden",
  },
  {
    name: "Tembisa",
    country: "ZA",
    timezone: "Africa/Johannesburg",
  },
  {
    name: "Phalaborwa",
    country: "ZA",
    timezone: "Africa/Johannesburg",
  },
  {
    name: "Bhisho",
    country: "ZA",
    timezone: "Africa/Johannesburg",
  },
  {
    name: "San Pedro",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Rodriguez",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Jolo",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Iriga City",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Khairpur Mir’s",
    country: "PK",
    timezone: "Asia/Karachi",
  },
  {
    name: "Peshawar",
    country: "PK",
    timezone: "Asia/Karachi",
  },
  {
    name: "Kielce",
    country: "PL",
    timezone: "Europe/Warsaw",
  },
  {
    name: "Kraków",
    country: "PL",
    timezone: "Europe/Warsaw",
  },
  {
    name: "East Jerusalem",
    country: "PS",
    timezone: "Asia/Hebron",
  },
  {
    name: "Drobeta-Turnu Severin",
    country: "RO",
    timezone: "Europe/Bucharest",
  },
  {
    name: "Belgrade",
    country: "RS",
    timezone: "Europe/Belgrade",
  },
  {
    name: "Bologna",
    country: "IT",
    timezone: "Europe/Rome",
  },
  {
    name: "Ar Ramthā",
    country: "JO",
    timezone: "Asia/Amman",
  },
  {
    name: "Ueda",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Kariya",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Kagoshima",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Isahaya",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Hino",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Hamamatsu",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Kirishima",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Kanggye",
    country: "KP",
    timezone: "Asia/Pyongyang",
  },
  {
    name: "Yangju",
    country: "KR",
    timezone: "Asia/Seoul",
  },
  {
    name: "Cheongju-si",
    country: "KR",
    timezone: "Asia/Seoul",
  },
  {
    name: "Turkestan",
    country: "KZ",
    timezone: "Asia/Almaty",
  },
  {
    name: "Dehiwala-Mount Lavinia",
    country: "LK",
    timezone: "Asia/Colombo",
  },
  {
    name: "Sirte",
    country: "LY",
    timezone: "Africa/Tripoli",
  },
  {
    name: "Lashio",
    country: "MM",
    timezone: "Asia/Yangon",
  },
  {
    name: "Iztapalapa",
    country: "MX",
    timezone: "America/Mexico_City",
  },
  {
    name: "Ciudad Madero",
    country: "MX",
    timezone: "America/Monterrey",
  },
  {
    name: "Venustiano Carranza",
    country: "MX",
    timezone: "America/Mexico_City",
  },
  {
    name: "Heroica Guaymas",
    country: "MX",
    timezone: "America/Hermosillo",
  },
  {
    name: "Aguascalientes",
    country: "MX",
    timezone: "America/Mexico_City",
  },
  {
    name: "Tonk",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Tiruvottiyūr",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Kollam",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Punāsa",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Orai",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Mangalore",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Madanapalle",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Jīnd",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Jamālpur",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Ghāziābād",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Cochin",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Bihār Sharīf",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Ahmedabad",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Jaigaon",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Sāmarrā’",
    country: "IQ",
    timezone: "Asia/Baghdad",
  },
  {
    name: "As Sulaymānīyah",
    country: "IQ",
    timezone: "Asia/Baghdad",
  },
  {
    name: "Shahr-e Kord",
    country: "IR",
    timezone: "Asia/Tehran",
  },
  {
    name: "Hamadān",
    country: "IR",
    timezone: "Asia/Tehran",
  },
  {
    name: "Eslāmshahr",
    country: "IR",
    timezone: "Asia/Tehran",
  },
  {
    name: "Trieste",
    country: "IT",
    timezone: "Europe/Rome",
  },
  {
    name: "Naples",
    country: "IT",
    timezone: "Europe/Rome",
  },
  {
    name: "Livorno",
    country: "IT",
    timezone: "Europe/Rome",
  },
  {
    name: "Forlì",
    country: "IT",
    timezone: "Europe/Rome",
  },
  {
    name: "Sha Tin Wai",
    country: "HK",
    timezone: "Asia/Hong_Kong",
  },
  {
    name: "Ma On Shan",
    country: "HK",
    timezone: "Asia/Hong_Kong",
  },
  {
    name: "Choloma",
    country: "HN",
    timezone: "America/Tegucigalpa",
  },
  {
    name: "Budapest XIII. kerület",
    country: "HU",
    timezone: "Europe/Budapest",
  },
  {
    name: "Rantauprapat",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Weru",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Tegal",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Lumajang",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Kuningan",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Kedungwuni",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Ambon",
    country: "ID",
    timezone: "Asia/Jayapura",
  },
  {
    name: "Taiping",
    country: "MY",
    timezone: "Asia/Kuala_Lumpur",
  },
  {
    name: "George Town",
    country: "MY",
    timezone: "Asia/Kuala_Lumpur",
  },
  {
    name: "Kuala Lumpur",
    country: "MY",
    timezone: "Asia/Kuala_Lumpur",
  },
  {
    name: "Maradi",
    country: "NE",
    timezone: "Africa/Niamey",
  },
  {
    name: "Warri",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Ikot Ekpene",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Ikire",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Yevlakh",
    country: "AZ",
    timezone: "Asia/Baku",
  },
  {
    name: "Yerevan",
    country: "AM",
    timezone: "Asia/Yerevan",
  },
  {
    name: "Villa Lugano",
    country: "AR",
    timezone: "America/Argentina/Buenos_Aires",
  },
  {
    name: "Melbourne",
    country: "AU",
    timezone: "Australia/Melbourne",
  },
  {
    name: "Ballarat",
    country: "AU",
    timezone: "Australia/Melbourne",
  },
  {
    name: "Novocherkassk",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Velikiy Novgorod",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Cherkessk",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Arzamas",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Nefteyugansk",
    country: "RU",
    timezone: "Asia/Yekaterinburg",
  },
  {
    name: "Kiselëvsk",
    country: "RU",
    timezone: "Asia/Novokuznetsk",
  },
  {
    name: "Seversk",
    country: "RU",
    timezone: "Asia/Tomsk",
  },
  {
    name: "Atbara",
    country: "SD",
    timezone: "Africa/Khartoum",
  },
  {
    name: "Umeå",
    country: "SE",
    timezone: "Europe/Stockholm",
  },
  {
    name: "Koidu",
    country: "SL",
    timezone: "Africa/Freetown",
  },
  {
    name: "Lampang",
    country: "TH",
    timezone: "Asia/Bangkok",
  },
  {
    name: "Rayong",
    country: "TH",
    timezone: "Asia/Bangkok",
  },
  {
    name: "Malatya",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Erzincan",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Antakya",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Sancaktepe",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Karabağlar",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Arusha",
    country: "TZ",
    timezone: "Africa/Dar_es_Salaam",
  },
  {
    name: "Yevpatoriya",
    country: "UA",
    timezone: "Europe/Simferopol",
  },
  {
    name: "Rancho Cucamonga",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Richmond",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "San Felipe",
    country: "VE",
    timezone: "America/Caracas",
  },
  {
    name: "Chí Linh",
    country: "VN",
    timezone: "Asia/Bangkok",
  },
  {
    name: "Kyiv",
    country: "UA",
    timezone: "Europe/Kyiv",
  },
  {
    name: "Cape Coral",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Fort Lauderdale",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Pembroke Pines",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Murfreesboro",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "Austin",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "Carrollton",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "North Peoria",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "Detroit",
    country: "US",
    timezone: "America/Detroit",
  },
  {
    name: "Rivne",
    country: "UA",
    timezone: "Europe/Kyiv",
  },
  {
    name: "Lviv",
    country: "UA",
    timezone: "Europe/Kyiv",
  },
  {
    name: "Aden",
    country: "YE",
    timezone: "Asia/Aden",
  },
  {
    name: "Worcester",
    country: "ZA",
    timezone: "Africa/Johannesburg",
  },
  {
    name: "Cajamarca",
    country: "PE",
    timezone: "America/Lima",
  },
  {
    name: "Mandaue City",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Lucena",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Laoag",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Shekhupura",
    country: "PK",
    timezone: "Asia/Karachi",
  },
  {
    name: "Mardan",
    country: "PK",
    timezone: "Asia/Karachi",
  },
  {
    name: "Yokosuka",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Toyohashi",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Miyakonojō",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Minamirinkan",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Matsue",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Kobe",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Kadoma",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Iida",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Higashi-ōsaka",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Chigasaki",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Sayama",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Asaka",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Phnom Penh",
    country: "KH",
    timezone: "Asia/Phnom_Penh",
  },
  {
    name: "Wŏnsan",
    country: "KP",
    timezone: "Asia/Pyongyang",
  },
  {
    name: "Jeongeup",
    country: "KR",
    timezone: "Asia/Seoul",
  },
  {
    name: "As Sālimīyah",
    country: "KW",
    timezone: "Asia/Kuwait",
  },
  {
    name: "Sidon",
    country: "LB",
    timezone: "Asia/Beirut",
  },
  {
    name: "Al Jumayl",
    country: "LY",
    timezone: "Africa/Tripoli",
  },
  {
    name: "Myeik",
    country: "MM",
    timezone: "Asia/Yangon",
  },
  {
    name: "Nouakchott",
    country: "MR",
    timezone: "Africa/Nouakchott",
  },
  {
    name: "Xochimilco",
    country: "MX",
    timezone: "America/Mexico_City",
  },
  {
    name: "Puebla",
    country: "MX",
    timezone: "America/Mexico_City",
  },
  {
    name: "Monclova",
    country: "MX",
    timezone: "America/Monterrey",
  },
  {
    name: "Guadalajara",
    country: "MX",
    timezone: "America/Mexico_City",
  },
  {
    name: "Ciudad Delicias",
    country: "MX",
    timezone: "America/Chihuahua",
  },
  {
    name: "Colonia del Valle",
    country: "MX",
    timezone: "America/Mexico_City",
  },
  {
    name: "Praga Południe",
    country: "PL",
    timezone: "Europe/Warsaw",
  },
  {
    name: "Ponce",
    country: "PR",
    timezone: "America/Puerto_Rico",
  },
  {
    name: "Târgu-Mureş",
    country: "RO",
    timezone: "Europe/Bucharest",
  },
  {
    name: "Yoshkar-Ola",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Rybnik",
    country: "PL",
    timezone: "Europe/Warsaw",
  },
  {
    name: "Rawang",
    country: "MY",
    timezone: "Asia/Kuala_Lumpur",
  },
  {
    name: "Onitsha",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Mubi",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Lekki",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Ikirun",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Calabar",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Lyon 03",
    country: "FR",
    timezone: "Europe/Paris",
  },
  {
    name: "Worcester",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Bonn",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Bochum-Hordel",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Sétif",
    country: "DZ",
    timezone: "Africa/Algiers",
  },
  {
    name: "Laghouat",
    country: "DZ",
    timezone: "Africa/Algiers",
  },
  {
    name: "Quevedo",
    country: "EC",
    timezone: "America/Guayaquil",
  },
  {
    name: "Kafr ash Shaykh",
    country: "EG",
    timezone: "Africa/Cairo",
  },
  {
    name: "Dayrūţ",
    country: "EG",
    timezone: "Africa/Cairo",
  },
  {
    name: "Port Said",
    country: "EG",
    timezone: "Africa/Cairo",
  },
  {
    name: "Banī Suwayf",
    country: "EG",
    timezone: "Africa/Cairo",
  },
  {
    name: "Asyūţ",
    country: "EG",
    timezone: "Africa/Cairo",
  },
  {
    name: "New Cairo",
    country: "EG",
    timezone: "Africa/Cairo",
  },
  {
    name: "Ourense",
    country: "ES",
    timezone: "Europe/Madrid",
  },
  {
    name: "León",
    country: "ES",
    timezone: "Europe/Madrid",
  },
  {
    name: "Ādīgrat",
    country: "ET",
    timezone: "Africa/Addis_Ababa",
  },
  {
    name: "Jhunjhunūn",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Jhānsi",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Hājīpur",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Durg",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Ambāla",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Ahmadnagar",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Haldia",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Al Fāw",
    country: "IQ",
    timezone: "Asia/Baghdad",
  },
  {
    name: "Tehran",
    country: "IR",
    timezone: "Asia/Tehran",
  },
  {
    name: "Rome",
    country: "IT",
    timezone: "Europe/Rome",
  },
  {
    name: "Parma",
    country: "IT",
    timezone: "Europe/Rome",
  },
  {
    name: "Cobán",
    country: "GT",
    timezone: "America/Guatemala",
  },
  {
    name: "Bissau",
    country: "GW",
    timezone: "Africa/Bissau",
  },
  {
    name: "Budapest",
    country: "HU",
    timezone: "Europe/Budapest",
  },
  {
    name: "Tebingtinggi",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Belawan",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Tanjung Pinang",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Pontianak",
    country: "ID",
    timezone: "Asia/Pontianak",
  },
  {
    name: "Palu",
    country: "ID",
    timezone: "Asia/Makassar",
  },
  {
    name: "Bengkulu",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Banyuwangi",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Teluknaga",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Solihull",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Peterborough",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "High Wycombe",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Cheltenham",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Chelmsford",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Bedford",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Bath",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Telford",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Teshi Old Town",
    country: "GH",
    timezone: "Africa/Accra",
  },
  {
    name: "Mönchengladbach",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Herne",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Hamburg-Mitte",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Friedrichshain",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Frankfurt am Main",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Vizianagaram",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Vijayawada",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Uppal Kalan",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Teni",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Sultānpur",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Narela",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Naihāti",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Mandsaur",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Chennai",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Madhyamgram",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Pforzheim",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Shenglilu",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Tunja",
    country: "CO",
    timezone: "America/Bogota",
  },
  {
    name: "Neiva",
    country: "CO",
    timezone: "America/Bogota",
  },
  {
    name: "Palma Soriano",
    country: "CU",
    timezone: "America/Havana",
  },
  {
    name: "Nicosia",
    country: "CY",
    timezone: "Asia/Nicosia",
  },
  {
    name: "Würzburg",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Ulm",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Parnaíba",
    country: "BR",
    timezone: "America/Fortaleza",
  },
  {
    name: "Jaboatão",
    country: "BR",
    timezone: "America/Recife",
  },
  {
    name: "Caucaia",
    country: "BR",
    timezone: "America/Fortaleza",
  },
  {
    name: "Uberaba",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Londrina",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Jandira",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Indaiatuba",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Aracaju",
    country: "BR",
    timezone: "America/Maceio",
  },
  {
    name: "Anápolis",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Ji Paraná",
    country: "BR",
    timezone: "America/Porto_Velho",
  },
  {
    name: "Brampton",
    country: "CA",
    timezone: "America/Toronto",
  },
  {
    name: "Richmond Hill",
    country: "CA",
    timezone: "America/Toronto",
  },
  {
    name: "Surrey",
    country: "CA",
    timezone: "America/Vancouver",
  },
  {
    name: "Lo Prado",
    country: "CL",
    timezone: "America/Santiago",
  },
  {
    name: "Kuqa",
    country: "CN",
    timezone: "Asia/Urumqi",
  },
  {
    name: "Ziyang",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Yongchuan",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Yinchuan",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Zhangjiagang",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Shuizhai",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Shanghai",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Jieyang",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Pulandian",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Longyan",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Longshui",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Licheng",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Xingyi",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Ezhou",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Wuzhishan",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Jalai Nur",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Dandong",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Baoshan",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Zenica",
    country: "BA",
    timezone: "Europe/Sarajevo",
  },
  {
    name: "Benguela",
    country: "AO",
    timezone: "Africa/Luanda",
  },
  {
    name: "Innsbruck",
    country: "AT",
    timezone: "Europe/Vienna",
  },
  {
    name: "Bendigo",
    country: "AU",
    timezone: "Australia/Melbourne",
  },
  {
    name: "Herāt",
    country: "AF",
    timezone: "Asia/Kabul",
  },
  {
    name: "Tandil",
    country: "AR",
    timezone: "America/Argentina/Buenos_Aires",
  },
  {
    name: "Santa Rosa",
    country: "AR",
    timezone: "America/Argentina/Salta",
  },
  {
    name: "Vienna",
    country: "AT",
    timezone: "Europe/Vienna",
  },
  {
    name: "Campeche",
    country: "MX",
    timezone: "America/Merida",
  },
  {
    name: "Tepexpan",
    country: "MX",
    timezone: "America/Mexico_City",
  },
  {
    name: "Cuauhtémoc",
    country: "MX",
    timezone: "America/Mexico_City",
  },
  {
    name: "Zapopan",
    country: "MX",
    timezone: "America/Mexico_City",
  },
  {
    name: "Shagamu",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Owo",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "San Juan",
    country: "PR",
    timezone: "America/Puerto_Rico",
  },
  {
    name: "Haarlem",
    country: "NL",
    timezone: "Europe/Amsterdam",
  },
  {
    name: "Dordrecht",
    country: "NL",
    timezone: "Europe/Amsterdam",
  },
  {
    name: "Pokhara",
    country: "NP",
    timezone: "Asia/Kathmandu",
  },
  {
    name: "Seeb",
    country: "OM",
    timezone: "Asia/Muscat",
  },
  {
    name: "Trujillo",
    country: "PE",
    timezone: "America/Lima",
  },
  {
    name: "Tacna",
    country: "PE",
    timezone: "America/Lima",
  },
  {
    name: "Puno",
    country: "PE",
    timezone: "America/Lima",
  },
  {
    name: "Davao",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Cagayan de Oro",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Angeles City",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Sargodha",
    country: "PK",
    timezone: "Asia/Karachi",
  },
  {
    name: "Shchukino",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Murom",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Tsaritsyno",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Kostroma",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Izhevsk",
    country: "RU",
    timezone: "Europe/Samara",
  },
  {
    name: "Tomsk",
    country: "RU",
    timezone: "Asia/Tomsk",
  },
  {
    name: "Krasnogvargeisky",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Admiralteisky",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Najrān",
    country: "SA",
    timezone: "Asia/Riyadh",
  },
  {
    name: "Al Qadarif",
    country: "SD",
    timezone: "Africa/Khartoum",
  },
  {
    name: "Winejok",
    country: "SS",
    timezone: "Africa/Juba",
  },
  {
    name: "Bangkok",
    country: "TH",
    timezone: "Asia/Bangkok",
  },
  {
    name: "Kamalia",
    country: "PK",
    timezone: "Asia/Karachi",
  },
  {
    name: "Jaranwala",
    country: "PK",
    timezone: "Asia/Karachi",
  },
  {
    name: "Islamabad",
    country: "PK",
    timezone: "Asia/Karachi",
  },
  {
    name: "Chakwama",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Zaanstad",
    country: "NL",
    timezone: "Europe/Amsterdam",
  },
  {
    name: "Velikiye Luki",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Ukhta",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Warren",
    country: "US",
    timezone: "America/Detroit",
  },
  {
    name: "Lincoln",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "The Bronx",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Burbank",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "San Jose",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Santa Clara",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "West Covina",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Arvada",
    country: "US",
    timezone: "America/Denver",
  },
  {
    name: "Sunrise Manor",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Samarkand",
    country: "UZ",
    timezone: "Asia/Samarkand",
  },
  {
    name: "Barinas",
    country: "VE",
    timezone: "America/Caracas",
  },
  {
    name: "Thốt Nốt",
    country: "VN",
    timezone: "Asia/Ho_Chi_Minh",
  },
  {
    name: "Da Nang",
    country: "VN",
    timezone: "Asia/Ho_Chi_Minh",
  },
  {
    name: "Dayton",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Oklahoma City",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "Charleston",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Laredo",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "Wichita Falls",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "Norfolk",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Nazilli",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Kaohsiung",
    country: "TW",
    timezone: "Asia/Taipei",
  },
  {
    name: "Hualien City",
    country: "TW",
    timezone: "Asia/Taipei",
  },
  {
    name: "Randburg",
    country: "ZA",
    timezone: "Africa/Johannesburg",
  },
  {
    name: "Kabwe",
    country: "ZM",
    timezone: "Africa/Lusaka",
  },
  {
    name: "Chipata",
    country: "ZM",
    timezone: "Africa/Lusaka",
  },
  {
    name: "Kwekwe",
    country: "ZW",
    timezone: "Africa/Harare",
  },
  {
    name: "Hechi",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Yintai",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Longling County",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Envigado",
    country: "CO",
    timezone: "America/Bogota",
  },
  {
    name: "Cienfuegos",
    country: "CU",
    timezone: "America/Havana",
  },
  {
    name: "Arroyo Naranjo",
    country: "CU",
    timezone: "America/Havana",
  },
  {
    name: "Ciudad Camilo Cienfuegos",
    country: "CU",
    timezone: "America/Havana",
  },
  {
    name: "Rostock",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Mascara",
    country: "DZ",
    timezone: "Africa/Algiers",
  },
  {
    name: "Madīnat an Naşr",
    country: "EG",
    timezone: "Africa/Cairo",
  },
  {
    name: "Idfū",
    country: "EG",
    timezone: "Africa/Cairo",
  },
  {
    name: "Disūq",
    country: "EG",
    timezone: "Africa/Cairo",
  },
  {
    name: "Al Ḩawāmidīyah",
    country: "EG",
    timezone: "Africa/Cairo",
  },
  {
    name: "Marbella",
    country: "ES",
    timezone: "Europe/Madrid",
  },
  {
    name: "Alcobendas",
    country: "ES",
    timezone: "Europe/Madrid",
  },
  {
    name: "Juazeiro do Norte",
    country: "BR",
    timezone: "America/Fortaleza",
  },
  {
    name: "Uberlândia",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Taubaté",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "São José",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Santa Luzia",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Rio de Janeiro",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Ribeirão Preto",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Itaboraí",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Curitiba",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Angra dos Reis",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Lida",
    country: "BY",
    timezone: "Europe/Minsk",
  },
  {
    name: "Burlington",
    country: "CA",
    timezone: "America/Toronto",
  },
  {
    name: "Kelowna",
    country: "CA",
    timezone: "America/Vancouver",
  },
  {
    name: "Milton",
    country: "CA",
    timezone: "America/Toronto",
  },
  {
    name: "Oakville",
    country: "CA",
    timezone: "America/Toronto",
  },
  {
    name: "Zhenzhou",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Yibin",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Tai’an",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Sanmenxia",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Rui’an",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Ningbo",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Luojiang",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Beiliu",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Jiujiang",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Jiaozuo",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Jiangmen",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Huizhou",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Changzhi",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Fuzhou",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Dazhou",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Longjing",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Harbin",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Haicheng",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Beipiao",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Shibganj",
    country: "BD",
    timezone: "Asia/Dhaka",
  },
  {
    name: "Kushtia",
    country: "BD",
    timezone: "Asia/Dhaka",
  },
  {
    name: "Nawābganj",
    country: "BD",
    timezone: "Asia/Dhaka",
  },
  {
    name: "Neuss",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Marzahn",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Kleinzschocher",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Kiel",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Hamm",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Halle (Saale)",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Gagnoa",
    country: "CI",
    timezone: "Africa/Abidjan",
  },
  {
    name: "Quilpué",
    country: "CL",
    timezone: "America/Santiago",
  },
  {
    name: "Tampere",
    country: "FI",
    timezone: "Europe/Helsinki",
  },
  {
    name: "Jyväskylä",
    country: "FI",
    timezone: "Europe/Helsinki",
  },
  {
    name: "Bolzano",
    country: "IT",
    timezone: "Europe/Rome",
  },
  {
    name: "Minato",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Ōtsu",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Miyazaki",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Komaki",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Fukayachō",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Iwaki",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Tama",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Namp’o",
    country: "KP",
    timezone: "Asia/Pyongyang",
  },
  {
    name: "Haeju",
    country: "KP",
    timezone: "Asia/Pyongyang",
  },
  {
    name: "Gyeongju",
    country: "KR",
    timezone: "Asia/Seoul",
  },
  {
    name: "Kokshetau",
    country: "KZ",
    timezone: "Asia/Almaty",
  },
  {
    name: "Ekibastuz",
    country: "KZ",
    timezone: "Asia/Almaty",
  },
  {
    name: "Kalmunai",
    country: "LK",
    timezone: "Asia/Colombo",
  },
  {
    name: "Klaipėda",
    country: "LT",
    timezone: "Europe/Vilnius",
  },
  {
    name: "Tripoli",
    country: "LY",
    timezone: "Africa/Tripoli",
  },
  {
    name: "Sale",
    country: "MA",
    timezone: "Africa/Casablanca",
  },
  {
    name: "Visakhapatnam",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Rohtak",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Raurkela",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Nāngloi Jāt",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Nandurbar",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Mothīhāri",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Māler Kotla",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Mahbūbnagar",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Khurja",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Khardah",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Kākināda",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Jāmuria",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Gangānagar",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Dhanbad",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Chitradurga",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Burhānpur",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Bokāro",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Bhadrāvati",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Baranagar",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Amarnāth",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Shahuwadi",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Torbat-e Ḩeydarīyeh",
    country: "IR",
    timezone: "Asia/Tehran",
  },
  {
    name: "Tabriz",
    country: "IR",
    timezone: "Asia/Tehran",
  },
  {
    name: "Saqqez",
    country: "IR",
    timezone: "Asia/Tehran",
  },
  {
    name: "Mashhad",
    country: "IR",
    timezone: "Asia/Tehran",
  },
  {
    name: "Abadan",
    country: "IR",
    timezone: "Asia/Tehran",
  },
  {
    name: "Dijon",
    country: "FR",
    timezone: "Europe/Paris",
  },
  {
    name: "Chiquimula",
    country: "GT",
    timezone: "America/Guatemala",
  },
  {
    name: "Tuen Mun",
    country: "HK",
    timezone: "Asia/Hong_Kong",
  },
  {
    name: "El Progreso",
    country: "HN",
    timezone: "America/Tegucigalpa",
  },
  {
    name: "Rijeka",
    country: "HR",
    timezone: "Europe/Zagreb",
  },
  {
    name: "Surabaya",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Prabumulih",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Mojokerto",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Banjar",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Adiwerna",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Merauke",
    country: "ID",
    timezone: "Asia/Jayapura",
  },
  {
    name: "Preston",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Leicester",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Colchester",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Bata",
    country: "GQ",
    timezone: "Africa/Malabo",
  },
  {
    name: "Tepic",
    country: "MX",
    timezone: "America/Mazatlan",
  },
  {
    name: "Nogales",
    country: "MX",
    timezone: "America/Hermosillo",
  },
  {
    name: "Ensenada",
    country: "MX",
    timezone: "America/Tijuana",
  },
  {
    name: "Seremban",
    country: "MY",
    timezone: "Asia/Kuala_Lumpur",
  },
  {
    name: "Ampang",
    country: "MY",
    timezone: "Asia/Kuala_Lumpur",
  },
  {
    name: "Nampula",
    country: "MZ",
    timezone: "Africa/Maputo",
  },
  {
    name: "Lagos",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Ilorin",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Ikere-Ekiti",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Capiatá",
    country: "PY",
    timezone: "America/Asuncion",
  },
  {
    name: "Niš",
    country: "RS",
    timezone: "Europe/Belgrade",
  },
  {
    name: "Maastricht",
    country: "NL",
    timezone: "Europe/Amsterdam",
  },
  {
    name: "Breda",
    country: "NL",
    timezone: "Europe/Amsterdam",
  },
  {
    name: "Trondheim",
    country: "NO",
    timezone: "Europe/Oslo",
  },
  {
    name: "Şaḩam",
    country: "OM",
    timezone: "Asia/Muscat",
  },
  {
    name: "San Miguelito",
    country: "PA",
    timezone: "America/Panama",
  },
  {
    name: "Magugpo Poblacion",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "San Mateo",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Roxas City",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Legaspi",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Dumaguete",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Saddiqabad",
    country: "PK",
    timezone: "Asia/Karachi",
  },
  {
    name: "Nishi-Tokyo-shi",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Kure",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Kurashiki",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Kochi",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Kasugai",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Kashihara-shi",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Hiroshima",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Daitō",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Beppu",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Fukushima",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Kushiro",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Ebetsu",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Neyagawa",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Saitama",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Kitale",
    country: "KE",
    timezone: "Africa/Nairobi",
  },
  {
    name: "Guri-si",
    country: "KR",
    timezone: "Asia/Seoul",
  },
  {
    name: "Kyzylorda",
    country: "KZ",
    timezone: "Asia/Qyzylorda",
  },
  {
    name: "Pavlodar",
    country: "KZ",
    timezone: "Asia/Almaty",
  },
  {
    name: "Mişrātah",
    country: "LY",
    timezone: "Africa/Tripoli",
  },
  {
    name: "Khemisset",
    country: "MA",
    timezone: "Africa/Casablanca",
  },
  {
    name: "Dawei",
    country: "MM",
    timezone: "Asia/Yangon",
  },
  {
    name: "Mandalay",
    country: "MM",
    timezone: "Asia/Yangon",
  },
  {
    name: "Macau",
    country: "MO",
    timezone: "Asia/Macau",
  },
  {
    name: "Mzuzu",
    country: "MW",
    timezone: "Africa/Blantyre",
  },
  {
    name: "Gujranwala",
    country: "PK",
    timezone: "Asia/Karachi",
  },
  {
    name: "Chiniot",
    country: "PK",
    timezone: "Asia/Karachi",
  },
  {
    name: "Chakwal",
    country: "PK",
    timezone: "Asia/Karachi",
  },
  {
    name: "Bhimber",
    country: "PK",
    timezone: "Asia/Karachi",
  },
  {
    name: "Sochi",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Ryazanskiy",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Petrozavodsk",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Nizhniy Novgorod",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Moscow",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Kursk",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Kislovodsk",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Ivanovskoye",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Jizan",
    country: "SA",
    timezone: "Asia/Riyadh",
  },
  {
    name: "Omdurman",
    country: "SD",
    timezone: "Africa/Khartoum",
  },
  {
    name: "An Nuhūd",
    country: "SD",
    timezone: "Africa/Khartoum",
  },
  {
    name: "Khartoum",
    country: "SD",
    timezone: "Africa/Khartoum",
  },
  {
    name: "Hargeysa",
    country: "SO",
    timezone: "Africa/Mogadishu",
  },
  {
    name: "Mejicanos",
    country: "SV",
    timezone: "America/El_Salvador",
  },
  {
    name: "Khlong Luang",
    country: "TH",
    timezone: "Asia/Bangkok",
  },
  {
    name: "Yongkang",
    country: "TW",
    timezone: "Asia/Taipei",
  },
  {
    name: "Keelung",
    country: "TW",
    timezone: "Asia/Taipei",
  },
  {
    name: "Morogoro",
    country: "TZ",
    timezone: "Africa/Dar_es_Salaam",
  },
  {
    name: "Iringa",
    country: "TZ",
    timezone: "Africa/Dar_es_Salaam",
  },
  {
    name: "Jersey City",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Bushwick",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Queens",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Chula Vista",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Corona",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Hayward",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Pomona",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Westminster",
    country: "US",
    timezone: "America/Denver",
  },
  {
    name: "Sunset Park",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Caracas",
    country: "VE",
    timezone: "America/Caracas",
  },
  {
    name: "Tân An",
    country: "VN",
    timezone: "Asia/Ho_Chi_Minh",
  },
  {
    name: "Biên Hòa",
    country: "VN",
    timezone: "Asia/Ho_Chi_Minh",
  },
  {
    name: "Kerch",
    country: "UA",
    timezone: "Europe/Simferopol",
  },
  {
    name: "Gulu",
    country: "UG",
    timezone: "Africa/Kampala",
  },
  {
    name: "Gainesville",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Sandy Springs",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Overland Park",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "Baton Rouge",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "Kansas City",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "Springfield",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "Hartford",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Elgin",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "Cambridge",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Worcester",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Roodepoort",
    country: "ZA",
    timezone: "Africa/Johannesburg",
  },
  {
    name: "Durban",
    country: "ZA",
    timezone: "Africa/Johannesburg",
  },
  {
    name: "Tver",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Stavropol’",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Tours",
    country: "FR",
    timezone: "Europe/Paris",
  },
  {
    name: "Amiens",
    country: "FR",
    timezone: "Europe/Paris",
  },
  {
    name: "Warrington",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Djibouti",
    country: "DJ",
    timezone: "Africa/Djibouti",
  },
  {
    name: "Bella Vista",
    country: "DO",
    timezone: "America/Santo_Domingo",
  },
  {
    name: "Constantine",
    country: "DZ",
    timezone: "Africa/Algiers",
  },
  {
    name: "Blida",
    country: "DZ",
    timezone: "Africa/Algiers",
  },
  {
    name: "Bejaïa",
    country: "DZ",
    timezone: "Africa/Algiers",
  },
  {
    name: "Reus",
    country: "ES",
    timezone: "Europe/Madrid",
  },
  {
    name: "Móstoles",
    country: "ES",
    timezone: "Europe/Madrid",
  },
  {
    name: "Dindigul",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Coimbatore",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Chikmagalūr",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Chandīgarh",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Bhuj",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Amritsar",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Ambur",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Akola",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Umm Qaşr",
    country: "IQ",
    timezone: "Asia/Baghdad",
  },
  {
    name: "Qazvin",
    country: "IR",
    timezone: "Asia/Tehran",
  },
  {
    name: "Arāk",
    country: "IR",
    timezone: "Asia/Tehran",
  },
  {
    name: "Coatepeque",
    country: "GT",
    timezone: "America/Guatemala",
  },
  {
    name: "San Pedro Sula",
    country: "HN",
    timezone: "America/Tegucigalpa",
  },
  {
    name: "Budapest XI. kerület",
    country: "HU",
    timezone: "Europe/Budapest",
  },
  {
    name: "Langsa",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Curug",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Ciputat",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Koblenz",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Großzschocher",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Norwich",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Archway",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Vellore",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Udgīr",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Shivpuri",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Sahāranpur",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Rāichūr",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Pallāvaram",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Mysore",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Monghyr",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Morena",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Hezhou",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Wenshan City",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Huocheng",
    country: "CN",
    timezone: "Asia/Urumqi",
  },
  {
    name: "Pereira",
    country: "CO",
    timezone: "America/Bogota",
  },
  {
    name: "Matanzas",
    country: "CU",
    timezone: "America/Havana",
  },
  {
    name: "Ouagadougou",
    country: "BF",
    timezone: "Africa/Ouagadougou",
  },
  {
    name: "Santa Cruz de la Sierra",
    country: "BO",
    timezone: "America/La_Paz",
  },
  {
    name: "Poços de Caldas",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Itaguaí",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Franco da Rocha",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Duque de Caxias",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Bragança Paulista",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Boa Vista",
    country: "BR",
    timezone: "America/Boa_Vista",
  },
  {
    name: "Baranovichi",
    country: "BY",
    timezone: "Europe/Minsk",
  },
  {
    name: "Guelph",
    country: "CA",
    timezone: "America/Toronto",
  },
  {
    name: "St. Catharines",
    country: "CA",
    timezone: "America/Toronto",
  },
  {
    name: "Okanagan",
    country: "CA",
    timezone: "America/Vancouver",
  },
  {
    name: "Boma",
    country: "CD",
    timezone: "Africa/Kinshasa",
  },
  {
    name: "Bandundu",
    country: "CD",
    timezone: "Africa/Kinshasa",
  },
  {
    name: "Zhaoqing",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Yong’an",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Yingtan",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Yan’an",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Xiazhen",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Xianning",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Wuxi",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Taizhou",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Suqian",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Pingshan",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Mingshui",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Meishan",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Lincang",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Kaili",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Hangu",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Haimen",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Guangshui",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Daliang",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Changzhou",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Baiyin",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Tongliao",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Tonghua",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Jixi",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Chengde",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Kandahār",
    country: "AF",
    timezone: "Asia/Kabul",
  },
  {
    name: "Tirana",
    country: "AL",
    timezone: "Europe/Tirane",
  },
  {
    name: "Lubango",
    country: "AO",
    timezone: "Africa/Luanda",
  },
  {
    name: "Gold Coast",
    country: "AU",
    timezone: "Australia/Brisbane",
  },
  {
    name: "Wollongong",
    country: "AU",
    timezone: "Australia/Sydney",
  },
  {
    name: "Mymensingh",
    country: "BD",
    timezone: "Asia/Dhaka",
  },
  {
    name: "Bremen",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Aalborg",
    country: "DK",
    timezone: "Europe/Copenhagen",
  },
  {
    name: "Relizane",
    country: "DZ",
    timezone: "Africa/Algiers",
  },
  {
    name: "Aswan",
    country: "EG",
    timezone: "Africa/Cairo",
  },
  {
    name: "Ashmūn",
    country: "EG",
    timezone: "Africa/Cairo",
  },
  {
    name: "Algeciras",
    country: "ES",
    timezone: "Europe/Madrid",
  },
  {
    name: "San Blas-Canillejas",
    country: "ES",
    timezone: "Europe/Madrid",
  },
  {
    name: "Madrid Centro",
    country: "ES",
    timezone: "Europe/Madrid",
  },
  {
    name: "Mek'ele",
    country: "ET",
    timezone: "Africa/Addis_Ababa",
  },
  {
    name: "H̱olon",
    country: "IL",
    timezone: "Asia/Jerusalem",
  },
  {
    name: "Pīlibhīt",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Palwal",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Navsari",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Kota",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Kaithal",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Hassan",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Hanumāngarh",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Gangāwati",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Kadapa",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Bharūch",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Barddhamān",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Mosul",
    country: "IQ",
    timezone: "Asia/Baghdad",
  },
  {
    name: "Basrah",
    country: "IQ",
    timezone: "Asia/Baghdad",
  },
  {
    name: "Sāveh",
    country: "IR",
    timezone: "Asia/Tehran",
  },
  {
    name: "Qom",
    country: "IR",
    timezone: "Asia/Tehran",
  },
  {
    name: "Marvdasht",
    country: "IR",
    timezone: "Asia/Tehran",
  },
  {
    name: "Bīrjand",
    country: "IR",
    timezone: "Asia/Tehran",
  },
  {
    name: "Trento",
    country: "IT",
    timezone: "Europe/Rome",
  },
  {
    name: "Tai Po",
    country: "HK",
    timezone: "Asia/Hong_Kong",
  },
  {
    name: "Port-de-Paix",
    country: "HT",
    timezone: "America/Port-au-Prince",
  },
  {
    name: "Jacmel",
    country: "HT",
    timezone: "America/Port-au-Prince",
  },
  {
    name: "Tanjungbalai",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Situbondo",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Padang",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Manado",
    country: "ID",
    timezone: "Asia/Makassar",
  },
  {
    name: "Cikampek",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Essen",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Ilford",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Bristol",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Brent",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Piraeus",
    country: "GR",
    timezone: "Europe/Athens",
  },
  {
    name: "Qianjiang",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Pingwu County",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Sancti Spíritus",
    country: "CU",
    timezone: "America/Havana",
  },
  {
    name: "Schöneberg",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Ruse",
    country: "BG",
    timezone: "Europe/Sofia",
  },
  {
    name: "Belém",
    country: "BR",
    timezone: "America/Belem",
  },
  {
    name: "Teófilo Otoni",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Praia Grande",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Ponta Grossa",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Piracicaba",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Osasco",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Guarujá",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Navapolatsk",
    country: "BY",
    timezone: "Europe/Minsk",
  },
  {
    name: "Abengourou",
    country: "CI",
    timezone: "Africa/Abidjan",
  },
  {
    name: "Altay",
    country: "CN",
    timezone: "Asia/Urumqi",
  },
  {
    name: "Wuda",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Linyi",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Leshan",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Fuling",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Chenggu",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Tieli",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Suihua",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Jiutai",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Hohhot",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Ajman City",
    country: "AE",
    timezone: "Asia/Dubai",
  },
  {
    name: "Kabul",
    country: "AF",
    timezone: "Asia/Kabul",
  },
  {
    name: "Formosa",
    country: "AR",
    timezone: "America/Argentina/Cordoba",
  },
  {
    name: "Favoriten",
    country: "AT",
    timezone: "Europe/Vienna",
  },
  {
    name: "Geelong",
    country: "AU",
    timezone: "Australia/Melbourne",
  },
  {
    name: "Samara",
    country: "RU",
    timezone: "Europe/Samara",
  },
  {
    name: "Naberezhnyye Chelny",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Derbent",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Bogorodskoye",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Arkhangel’sk",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Mezhdurechensk",
    country: "RU",
    timezone: "Asia/Novokuznetsk",
  },
  {
    name: "Vasyl'evsky Ostrov",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Wad Medani",
    country: "SD",
    timezone: "Africa/Khartoum",
  },
  {
    name: "Soyapango",
    country: "SV",
    timezone: "America/El_Salvador",
  },
  {
    name: "N'Djamena",
    country: "TD",
    timezone: "Africa/Ndjamena",
  },
  {
    name: "Isfara",
    country: "TJ",
    timezone: "Asia/Dushanbe",
  },
  {
    name: "Sousse",
    country: "TN",
    timezone: "Africa/Tunis",
  },
  {
    name: "Gabès",
    country: "TN",
    timezone: "Africa/Tunis",
  },
  {
    name: "Sevastopol",
    country: "UA",
    timezone: "Europe/Simferopol",
  },
  {
    name: "Kremenchuk",
    country: "UA",
    timezone: "Europe/Kyiv",
  },
  {
    name: "Clearwater",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Kansas City",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "Baltimore",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Columbia",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Arlington",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "Garland",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "San Antonio",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "Chesapeake",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Richmond",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Des Moines",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "Kayseri",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Bade",
    country: "TW",
    timezone: "Asia/Taipei",
  },
  {
    name: "Malacca",
    country: "MY",
    timezone: "Asia/Kuala_Lumpur",
  },
  {
    name: "Offa",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Nnewi",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Ijebu-Ode",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Ejigbo",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Birnin Kebbi",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Phú Quốc",
    country: "VN",
    timezone: "Asia/Ho_Chi_Minh",
  },
  {
    name: "Mukalla",
    country: "YE",
    timezone: "Asia/Aden",
  },
  {
    name: "Livingstone",
    country: "ZM",
    timezone: "Africa/Lusaka",
  },
  {
    name: "Harare",
    country: "ZW",
    timezone: "Africa/Harare",
  },
  {
    name: "Syktyvkar",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Sterlitamak",
    country: "RU",
    timezone: "Asia/Yekaterinburg",
  },
  {
    name: "Naucalpan de Juárez",
    country: "MX",
    timezone: "America/Mexico_City",
  },
  {
    name: "Córdoba",
    country: "MX",
    timezone: "America/Mexico_City",
  },
  {
    name: "Saltillo",
    country: "MX",
    timezone: "America/Monterrey",
  },
  {
    name: "Stavanger",
    country: "NO",
    timezone: "Europe/Oslo",
  },
  {
    name: "Hetauda",
    country: "NP",
    timezone: "Asia/Kathmandu",
  },
  {
    name: "Auckland",
    country: "NZ",
    timezone: "Pacific/Auckland",
  },
  {
    name: "Chincha Alta",
    country: "PE",
    timezone: "America/Lima",
  },
  {
    name: "Mati",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Biñan",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Sector 6",
    country: "RO",
    timezone: "Europe/Bucharest",
  },
  {
    name: "Suita",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Nishio",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Musashino",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Izumi",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Kani",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Thika",
    country: "KE",
    timezone: "Africa/Nairobi",
  },
  {
    name: "Sunch’ŏn",
    country: "KP",
    timezone: "Asia/Pyongyang",
  },
  {
    name: "Busan",
    country: "KR",
    timezone: "Asia/Seoul",
  },
  {
    name: "Osan",
    country: "KR",
    timezone: "Asia/Seoul",
  },
  {
    name: "Gyeongsan-si",
    country: "KR",
    timezone: "Asia/Seoul",
  },
  {
    name: "Seongnam-si",
    country: "KR",
    timezone: "Asia/Seoul",
  },
  {
    name: "Trincomalee",
    country: "LK",
    timezone: "Asia/Colombo",
  },
  {
    name: "Kaunas",
    country: "LT",
    timezone: "Europe/Vilnius",
  },
  {
    name: "Sabhā",
    country: "LY",
    timezone: "Africa/Tripoli",
  },
  {
    name: "Toliara",
    country: "MG",
    timezone: "Indian/Antananarivo",
  },
  {
    name: "Elizabeth",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Simi Valley",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Universal City",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Lakewood",
    country: "US",
    timezone: "America/Denver",
  },
  {
    name: "Salem",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Chirchiq",
    country: "UZ",
    timezone: "Asia/Tashkent",
  },
  {
    name: "Valle de La Pascua",
    country: "VE",
    timezone: "America/Caracas",
  },
  {
    name: "Huế",
    country: "VN",
    timezone: "Asia/Bangkok",
  },
  {
    name: "Cà Mau",
    country: "VN",
    timezone: "Asia/Ho_Chi_Minh",
  },
  {
    name: "Sanhe",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Hulunbuir",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Yopal",
    country: "CO",
    timezone: "America/Bogota",
  },
  {
    name: "Sabanalarga",
    country: "CO",
    timezone: "America/Bogota",
  },
  {
    name: "Wiesbaden",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Tlemcen",
    country: "DZ",
    timezone: "Africa/Algiers",
  },
  {
    name: "District of Taher",
    country: "DZ",
    timezone: "Africa/Algiers",
  },
  {
    name: "Daule",
    country: "EC",
    timezone: "America/Guayaquil",
  },
  {
    name: "Mallawī",
    country: "EG",
    timezone: "Africa/Cairo",
  },
  {
    name: "Montpellier",
    country: "FR",
    timezone: "Europe/Paris",
  },
  {
    name: "Grenoble",
    country: "FR",
    timezone: "Europe/Paris",
  },
  {
    name: "Tottenham",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Kallithéa",
    country: "GR",
    timezone: "Europe/Athens",
  },
  {
    name: "Jalapa",
    country: "GT",
    timezone: "America/Guatemala",
  },
  {
    name: "Escuintla",
    country: "GT",
    timezone: "America/Guatemala",
  },
  {
    name: "Carrefour",
    country: "HT",
    timezone: "America/Port-au-Prince",
  },
  {
    name: "Székesfehérvár",
    country: "HU",
    timezone: "Europe/Budapest",
  },
  {
    name: "Ţimā",
    country: "EG",
    timezone: "Africa/Cairo",
  },
  {
    name: "Gunungsitoli",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Sohag",
    country: "EG",
    timezone: "Africa/Cairo",
  },
  {
    name: "Laayoune",
    country: "EH",
    timezone: "Africa/El_Aaiun",
  },
  {
    name: "Watampone",
    country: "ID",
    timezone: "Asia/Makassar",
  },
  {
    name: "Ungaran",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Soreang",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Samarinda",
    country: "ID",
    timezone: "Asia/Makassar",
  },
  {
    name: "Huelva",
    country: "ES",
    timezone: "Europe/Madrid",
  },
  {
    name: "Dos Hermanas",
    country: "ES",
    timezone: "Europe/Madrid",
  },
  {
    name: "Jayapura",
    country: "ID",
    timezone: "Asia/Jayapura",
  },
  {
    name: "Offenbach",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Puente de Vallecas",
    country: "ES",
    timezone: "Europe/Madrid",
  },
  {
    name: "Lleida",
    country: "ES",
    timezone: "Europe/Madrid",
  },
  {
    name: "Marienthal",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Newcastle upon Tyne",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Hosa’ina",
    country: "ET",
    timezone: "Africa/Addis_Ababa",
  },
  {
    name: "Burnley",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Nanchuan",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Wanzhou",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Zipaquirá",
    country: "CO",
    timezone: "America/Bogota",
  },
  {
    name: "Magangué",
    country: "CO",
    timezone: "America/Bogota",
  },
  {
    name: "Helsinki",
    country: "FI",
    timezone: "Europe/Helsinki",
  },
  {
    name: "Buenaventura",
    country: "CO",
    timezone: "America/Bogota",
  },
  {
    name: "Diez de Octubre",
    country: "CU",
    timezone: "America/Havana",
  },
  {
    name: "Varna",
    country: "BG",
    timezone: "Europe/Sofia",
  },
  {
    name: "Porto-Novo",
    country: "BJ",
    timezone: "Africa/Porto-Novo",
  },
  {
    name: "Olinda",
    country: "BR",
    timezone: "America/Recife",
  },
  {
    name: "Araguaína",
    country: "BR",
    timezone: "America/Araguaina",
  },
  {
    name: "Santo André",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Pindamonhangaba",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Limeira",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "South Dublin",
    country: "IE",
    timezone: "Europe/Dublin",
  },
  {
    name: "Guarapuava",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Criciúma",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Chapecó",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Caxias do Sul",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Ashkelon",
    country: "IL",
    timezone: "Asia/Jerusalem",
  },
  {
    name: "Bauru",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Vidisha",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Vadodara",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Sāngli",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Proddatūr",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Babruysk",
    country: "BY",
    timezone: "Europe/Minsk",
  },
  {
    name: "Cambridge",
    country: "CA",
    timezone: "America/Toronto",
  },
  {
    name: "Mirzāpur",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Loni",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Jamnagar",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Guwahati",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Gadag",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Deoghar",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Chittaurgarh",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Bhusāval",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Bānda",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Bāli",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Anantapur",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Prayagraj",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Alīgarh",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Thoothukudi",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Ad Dīwānīyah",
    country: "IQ",
    timezone: "Asia/Baghdad",
  },
  {
    name: "Kermanshah",
    country: "IR",
    timezone: "Asia/Tehran",
  },
  {
    name: "Bāneh",
    country: "IR",
    timezone: "Asia/Tehran",
  },
  {
    name: "Coquimbo",
    country: "CL",
    timezone: "America/Santiago",
  },
  {
    name: "Mokolo",
    country: "CM",
    timezone: "Africa/Douala",
  },
  {
    name: "Bamenda",
    country: "CM",
    timezone: "Africa/Douala",
  },
  {
    name: "Yuxi",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Zhengding",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Yuyao",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Yezhou",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Xiulin",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Wushan",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Tianfu",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Shiyan",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Quzhou",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Salerno",
    country: "IT",
    timezone: "Europe/Rome",
  },
  {
    name: "Pingliang",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Puning",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Jining",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Jingzhi",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Jijiang",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Huzhou",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Dasha",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Mestre",
    country: "IT",
    timezone: "Europe/Rome",
  },
  {
    name: "Chizhou",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Chengdu",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Cangzhou",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Boshan",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Beibei",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Bachuan",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Villeurbanne",
    country: "FR",
    timezone: "Europe/Paris",
  },
  {
    name: "Dunhua",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Paris",
    country: "FR",
    timezone: "Europe/Paris",
  },
  {
    name: "Vanadzor",
    country: "AM",
    timezone: "Asia/Yerevan",
  },
  {
    name: "Quilmes",
    country: "AR",
    timezone: "America/Argentina/Buenos_Aires",
  },
  {
    name: "San Rafael",
    country: "AR",
    timezone: "America/Argentina/Mendoza",
  },
  {
    name: "Neuquén",
    country: "AR",
    timezone: "America/Argentina/Salta",
  },
  {
    name: "Comodoro Rivadavia",
    country: "AR",
    timezone: "America/Argentina/Catamarca",
  },
  {
    name: "Ottakring",
    country: "AT",
    timezone: "Europe/Vienna",
  },
  {
    name: "Floridsdorf",
    country: "AT",
    timezone: "Europe/Vienna",
  },
  {
    name: "Aberdeen",
    country: "HK",
    timezone: "Asia/Hong_Kong",
  },
  {
    name: "Tung Chung",
    country: "HK",
    timezone: "Asia/Hong_Kong",
  },
  {
    name: "Pematangsiantar",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Semarang",
    country: "ID",
    timezone: "Asia/Jakarta",
  },
  {
    name: "Palangkaraya",
    country: "ID",
    timezone: "Asia/Pontianak",
  },
  {
    name: "Mariupol",
    country: "UA",
    timezone: "Europe/Kyiv",
  },
  {
    name: "Bontang",
    country: "ID",
    timezone: "Asia/Makassar",
  },
  {
    name: "Kryvyy Rih",
    country: "UA",
    timezone: "Europe/Kyiv",
  },
  {
    name: "Münster",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Ingolstadt",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Heidelberg",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Harburg",
    country: "DE",
    timezone: "Europe/Berlin",
  },
  {
    name: "Raleigh",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Harrow",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Houston",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "Belfast",
    country: "GB",
    timezone: "Europe/London",
  },
  {
    name: "Waco",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "Batumi",
    country: "GE",
    timezone: "Asia/Tbilisi",
  },
  {
    name: "Sekondi-Takoradi",
    country: "GH",
    timezone: "Africa/Accra",
  },
  {
    name: "Kolār",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Kırşehir",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Erzurum",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Bingöl",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Düzce",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Çorum",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Çorlu",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Elbląg",
    country: "PL",
    timezone: "Europe/Warsaw",
  },
  {
    name: "Częstochowa",
    country: "PL",
    timezone: "Europe/Warsaw",
  },
  {
    name: "Lower Hutt",
    country: "NZ",
    timezone: "Pacific/Auckland",
  },
  {
    name: "Westonaria",
    country: "ZA",
    timezone: "Africa/Johannesburg",
  },
  {
    name: "Welkom",
    country: "ZA",
    timezone: "Africa/Johannesburg",
  },
  {
    name: "Rustenburg",
    country: "ZA",
    timezone: "Africa/Johannesburg",
  },
  {
    name: "Queenstown",
    country: "ZA",
    timezone: "Africa/Johannesburg",
  },
  {
    name: "Alberton",
    country: "ZA",
    timezone: "Africa/Johannesburg",
  },
  {
    name: "Centurion",
    country: "ZA",
    timezone: "Africa/Johannesburg",
  },
  {
    name: "Juliaca",
    country: "PE",
    timezone: "America/Lima",
  },
  {
    name: "Toledo",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Tando Adam",
    country: "PK",
    timezone: "Asia/Karachi",
  },
  {
    name: "Zielona Góra",
    country: "PL",
    timezone: "Europe/Warsaw",
  },
  {
    name: "Tychy",
    country: "PL",
    timezone: "Europe/Warsaw",
  },
  {
    name: "Nablus",
    country: "PS",
    timezone: "Asia/Hebron",
  },
  {
    name: "Tuxtla",
    country: "MX",
    timezone: "America/Mexico_City",
  },
  {
    name: "Texcoco de Mora",
    country: "MX",
    timezone: "America/Mexico_City",
  },
  {
    name: "Coacalco",
    country: "MX",
    timezone: "America/Mexico_City",
  },
  {
    name: "Benito Juárez",
    country: "MX",
    timezone: "America/Mexico_City",
  },
  {
    name: "Modakeke",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Lafiagi",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Ila Orangun",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Abeokuta",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Puerto Vallarta",
    country: "MX",
    timezone: "America/Mexico_City",
  },
  {
    name: "Ciudad Acuña",
    country: "MX",
    timezone: "America/Matamoros",
  },
  {
    name: "Amman",
    country: "JO",
    timezone: "Asia/Amman",
  },
  {
    name: "Shah Alam",
    country: "MY",
    timezone: "Asia/Kuala_Lumpur",
  },
  {
    name: "Komatsu",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Agadez",
    country: "NE",
    timezone: "Africa/Niamey",
  },
  {
    name: "Kamirenjaku",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Hikone",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Hachiōji",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Fukuoka",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Minna",
    country: "NG",
    timezone: "Africa/Lagos",
  },
  {
    name: "Sakura",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Fuchū",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Hŭngnam",
    country: "KP",
    timezone: "Asia/Pyongyang",
  },
  {
    name: "Pyeongtaek",
    country: "KR",
    timezone: "Asia/Seoul",
  },
  {
    name: "Masan",
    country: "KR",
    timezone: "Asia/Seoul",
  },
  {
    name: "Goyang-si",
    country: "KR",
    timezone: "Asia/Seoul",
  },
  {
    name: "Atyrau",
    country: "KZ",
    timezone: "Asia/Atyrau",
  },
  {
    name: "Taldykorgan",
    country: "KZ",
    timezone: "Asia/Almaty",
  },
  {
    name: "Semey",
    country: "KZ",
    timezone: "Asia/Almaty",
  },
  {
    name: "Monrovia",
    country: "LR",
    timezone: "Africa/Monrovia",
  },
  {
    name: "Nador",
    country: "MA",
    timezone: "Africa/Casablanca",
  },
  {
    name: "Meknès",
    country: "MA",
    timezone: "Africa/Casablanca",
  },
  {
    name: "Tiraspol",
    country: "MD",
    timezone: "Europe/Chisinau",
  },
  {
    name: "Antananarivo",
    country: "MG",
    timezone: "Indian/Antananarivo",
  },
  {
    name: "Spanish Town",
    country: "JM",
    timezone: "America/Jamaica",
  },
  {
    name: "Hengelo",
    country: "NL",
    timezone: "Europe/Amsterdam",
  },
  {
    name: "Takarazuka",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Nagano",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Apeldoorn",
    country: "NL",
    timezone: "Europe/Amsterdam",
  },
  {
    name: "Ageoshimo",
    country: "JP",
    timezone: "Asia/Tokyo",
  },
  {
    name: "Kisii",
    country: "KE",
    timezone: "Africa/Nairobi",
  },
  {
    name: "Ksar El Kebir",
    country: "MA",
    timezone: "Africa/Casablanca",
  },
  {
    name: "Toamasina",
    country: "MG",
    timezone: "Indian/Antananarivo",
  },
  {
    name: "Antsiranana",
    country: "MG",
    timezone: "Indian/Antananarivo",
  },
  {
    name: "Thaton",
    country: "MM",
    timezone: "Asia/Yangon",
  },
  {
    name: "Malolos",
    country: "PH",
    timezone: "Asia/Manila",
  },
  {
    name: "Saint Petersburg",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Novotroitsk",
    country: "RU",
    timezone: "Asia/Yekaterinburg",
  },
  {
    name: "Novorossiysk",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Novokuybyshevsk",
    country: "RU",
    timezone: "Europe/Samara",
  },
  {
    name: "Novocheboksarsk",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Mar’ino",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Wazirabad",
    country: "PK",
    timezone: "Asia/Karachi",
  },
  {
    name: "Mingora",
    country: "PK",
    timezone: "Asia/Karachi",
  },
  {
    name: "Petaẖ Tiqva",
    country: "IL",
    timezone: "Asia/Jerusalem",
  },
  {
    name: "Astrakhan",
    country: "RU",
    timezone: "Europe/Astrakhan",
  },
  {
    name: "Noyabrsk",
    country: "RU",
    timezone: "Asia/Yekaterinburg",
  },
  {
    name: "Shyamnagar",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Shāntipur",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Secunderabad",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Rishra",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Purnia",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Achinsk",
    country: "RU",
    timezone: "Asia/Krasnoyarsk",
  },
  {
    name: "Dharashiv",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Neyveli",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Blagoveshchensk",
    country: "RU",
    timezone: "Asia/Yakutsk",
  },
  {
    name: "Kalyān",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Jaipur",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Hindupur",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Guntur",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Gāndhīdhām",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Fyzābād",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Davangere",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Chhatarpur",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Bhīlwāra",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Bhilai",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Bhavnagar",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Bhāgalpur",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Bhadreswar",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Belagavi",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Azamgarh",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Amrāvati",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Achalpur",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Singrauli",
    country: "IN",
    timezone: "Asia/Kolkata",
  },
  {
    name: "Shiraz",
    country: "IR",
    timezone: "Asia/Tehran",
  },
  {
    name: "Shahrud",
    country: "IR",
    timezone: "Asia/Tehran",
  },
  {
    name: "Khomeynī Shahr",
    country: "IR",
    timezone: "Asia/Tehran",
  },
  {
    name: "Thiès Nones",
    country: "SN",
    timezone: "Africa/Dakar",
  },
  {
    name: "Aleppo",
    country: "SY",
    timezone: "Asia/Damascus",
  },
  {
    name: "Messina",
    country: "IT",
    timezone: "Europe/Rome",
  },
  {
    name: "Catania",
    country: "IT",
    timezone: "Europe/Rome",
  },
  {
    name: "Ar Raqqah",
    country: "SY",
    timezone: "Asia/Damascus",
  },
  {
    name: "Karaman",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Monza",
    country: "IT",
    timezone: "Europe/Rome",
  },
  {
    name: "Zonguldak",
    country: "TR",
    timezone: "Europe/Istanbul",
  },
  {
    name: "Gojra",
    country: "PK",
    timezone: "Asia/Karachi",
  },
  {
    name: "Burewala",
    country: "PK",
    timezone: "Asia/Karachi",
  },
  {
    name: "Ahmadpur East",
    country: "PK",
    timezone: "Asia/Karachi",
  },
  {
    name: "Sheepshead Bay",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Green Bay",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "Pueblo",
    country: "US",
    timezone: "America/Denver",
  },
  {
    name: "Midland",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "West Jordan",
    country: "US",
    timezone: "America/Denver",
  },
  {
    name: "San Cristóbal",
    country: "VE",
    timezone: "America/Caracas",
  },
  {
    name: "Vũng Tàu",
    country: "VN",
    timezone: "Asia/Ho_Chi_Minh",
  },
  {
    name: "Pleiku",
    country: "VN",
    timezone: "Asia/Ho_Chi_Minh",
  },
  {
    name: "Yonkers",
    country: "US",
    timezone: "America/New_York",
  },
  {
    name: "Luhansk",
    country: "UA",
    timezone: "Europe/Kyiv",
  },
  {
    name: "Kramatorsk",
    country: "UA",
    timezone: "Europe/Kyiv",
  },
  {
    name: "Antioch",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Costa Mesa",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Fairfield",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Hollywood",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Evansville",
    country: "US",
    timezone: "America/Chicago",
  },
  {
    name: "Oceanside",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Palmdale",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Thornton",
    country: "US",
    timezone: "America/Denver",
  },
  {
    name: "Greeley",
    country: "US",
    timezone: "America/Denver",
  },
  {
    name: "Seattle",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Spokane",
    country: "US",
    timezone: "America/Los_Angeles",
  },
  {
    name: "Barquisimeto",
    country: "VE",
    timezone: "America/Caracas",
  },
  {
    name: "Ninh Hòa",
    country: "VN",
    timezone: "Asia/Ho_Chi_Minh",
  },
  {
    name: "Kolomna",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Groznyy",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Belgorod",
    country: "RU",
    timezone: "Europe/Moscow",
  },
  {
    name: "Krasnoyarsk",
    country: "RU",
    timezone: "Asia/Krasnoyarsk",
  },
  {
    name: "Khobar",
    country: "SA",
    timezone: "Asia/Riyadh",
  },
  {
    name: "Gereida",
    country: "SD",
    timezone: "Africa/Khartoum",
  },
  {
    name: "South Bend",
    country: "US",
    timezone: "America/Indiana/Indianapolis",
  },
  {
    name: "Grand Rapids",
    country: "US",
    timezone: "America/Detroit",
  },
  {
    name: "Lansing",
    country: "US",
    timezone: "America/Detroit",
  },
  {
    name: "Berbera",
    country: "SO",
    timezone: "Africa/Mogadishu",
  },
  {
    name: "Juba",
    country: "SS",
    timezone: "Africa/Juba",
  },
  {
    name: "Al Ḩasakah",
    country: "SY",
    timezone: "Asia/Damascus",
  },
  {
    name: "Lomé",
    country: "TG",
    timezone: "Africa/Lome",
  },
  {
    name: "Pinetown",
    country: "ZA",
    timezone: "Africa/Johannesburg",
  },
  {
    name: "Johannesburg",
    country: "ZA",
    timezone: "Africa/Johannesburg",
  },
  {
    name: "East London",
    country: "ZA",
    timezone: "Africa/Johannesburg",
  },
  {
    name: "Carletonville",
    country: "ZA",
    timezone: "Africa/Johannesburg",
  },
  {
    name: "Nakhon Ratchasima",
    country: "TH",
    timezone: "Asia/Bangkok",
  },
  {
    name: "Charleroi",
    country: "BE",
    timezone: "Europe/Brussels",
  },
  {
    name: "Kandi",
    country: "BJ",
    timezone: "Africa/Porto-Novo",
  },
  {
    name: "Itatiba",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Itapetininga",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Ar Rayyān",
    country: "QA",
    timezone: "Asia/Qatar",
  },
  {
    name: "Itapecerica da Serra",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Botucatu",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Araruama",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Apucarana",
    country: "BR",
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Burnaby",
    country: "CA",
    timezone: "America/Vancouver",
  },
  {
    name: "Waterloo",
    country: "CA",
    timezone: "America/Toronto",
  },
  {
    name: "Butembo",
    country: "CD",
    timezone: "Africa/Lubumbashi",
  },
  {
    name: "Puerto Montt",
    country: "CL",
    timezone: "America/Santiago",
  },
  {
    name: "Xinyuan",
    country: "CN",
    timezone: "Asia/Urumqi",
  },
  {
    name: "Zemun",
    country: "RS",
    timezone: "Europe/Belgrade",
  },
  {
    name: "Zhonghe",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Anyang",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Qingzhou",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Qinhuangdao",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Nanyang",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Meizhou",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Jinhua",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Yangjiang",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Gulin",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Dongguan",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Buhe",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Beijing",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Banan",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Tieling",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Hengshan",
    country: "CN",
    timezone: "Asia/Shanghai",
  },
  {
    name: "Mostar",
    country: "BA",
    timezone: "Europe/Sarajevo",
  },
  {
    name: "Narsingdi",
    country: "BD",
    timezone: "Asia/Dhaka",
  },
  {
    name: "Khulna",
    country: "BD",
    timezone: "Asia/Dhaka",
  },
  {
    name: "Natore",
    country: "BD",
    timezone: "Asia/Dhaka",
  },
  {
    name: "Sydney",
    country: "AU",
    timezone: "Australia/Sydney",
  },
];

export default cities
