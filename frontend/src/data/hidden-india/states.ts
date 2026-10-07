import { StateInfo, DistrictInfo } from './types';

// Helper to construct district objects
const createDistricts = (
  stateSlug: string,
  stateName: string,
  list: Array<{ name: string; slug?: string; description?: string; heroImage?: string; aliases?: string[] }>
): DistrictInfo[] => {
  return list.map((item) => {
    const slug = item.slug || item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return {
      id: `${stateSlug}-${slug}`,
      name: item.name,
      slug,
      stateSlug,
      stateName,
      description: item.description || `Explore the lesser-known landscapes, indigenous craft roots and tranquil settlements of ${item.name}.`,
      heroImage: item.heroImage || '/hero-himalaya.jpg',
      aliases: item.aliases || [],
    };
  });
};

export const STATES_DATA: StateInfo[] = [
  {
    id: 'gujarat',
    name: 'Gujarat',
    slug: 'gujarat',
    tagline: 'Salt deserts, craft traditions and ancient maritime horizons.',
    description: 'Beyond the commercial corridors lie endless salt flats, fossil-rich islands, tribal forest settlements in Dang, and centuries-old artisan guilds.',
    heroImage: 'https://images.unsplash.com/photo-1599827552599-ea9a039d93ee?auto=format&fit=crop&w=1600&q=80',
    districts: createDistricts('gujarat', 'Gujarat', [
      { name: 'Ahmedabad', description: 'Terracotta pol lanes, stepwells and Sabarmati craft corridors.' },
      { name: 'Amreli', description: 'Savanna plains and pastoral grasslands bordering Gir sanctuary.' },
      { name: 'Anand', description: 'Cooperative dairy villages and serene Charotar countryside.' },
      { name: 'Aravalli', description: 'Forested hills, ancient tribal sanctuaries and stepwell lore.' },
      { name: 'Banaskantha', description: 'Arid scrublands, marble sculptors and sacred Ambaji foothills.' },
      { name: 'Bharuch', description: 'Ancient estuary port on the sacred Narmada river.' },
      { name: 'Bhavnagar', description: 'Palitana stone steps, Blackbuck grasslands and coastal salt farms.' },
      { name: 'Botad', description: 'Rolling Kathiawar farmlands and historic devotional retreats.' },
      { name: 'Chhota Udepur', description: 'Rathwa tribal heartland renowned for sacred Pithora wall murals.' },
      { name: 'Dahod', description: 'Bhil community hills, maize terraces and folk beadcraft.' },
      { name: 'Dang', description: 'Dense Sahyadri bamboo forests, monsoon waterfalls and Warli tribal hamlets.', heroImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80' },
      { name: 'Devbhoomi Dwarka', description: 'Remote coastal cliffs, coral shoals and maritime heritage.' },
      { name: 'Gandhinagar', description: 'Lush riverine ravines and monumental stone craftsmanship.' },
      { name: 'Gir Somnath', description: 'Asiatic lion territory, secluded fishing coves and coastal cliffs.' },
      { name: 'Jamnagar', description: 'Marine national park corals, Bandhani tie-dye master artisans.' },
      { name: 'Junagadh', description: 'Ancient rock edicts of Ashoka, Girnar mountain stairs and stepwells.' },
      {
        name: 'Kachchh',
        slug: 'kutch',
        aliases: ['kachchh', 'kutch'],
        description: 'Vast white salt desert, Rogan art masters, fossil beds and resilient desert hamlets.',
        heroImage: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=1200&q=80'
      },
      { name: 'Kheda', description: 'Historic tobacco and spice farming hamlets of central Gujarat.' },
      { name: 'Mahisagar', description: 'Fossilized dinosaur nesting grounds and Mahi river gorges.' },
      { name: 'Mehsana', description: 'Sun temple architectural brilliance and quiet stepwell settlements.' },
      { name: 'Morbi', description: 'Traditional ceramic kilns and suspension bridge history over Machchhu.' },
      { name: 'Narmada', description: 'Sacred river valley, Shoolpaneshwar wildlife sanctuary and tribal groves.' },
      { name: 'Navsari', description: 'Parsi heritage settlements, fragrant chikoo orchards and quiet coastlines.' },
      { name: 'Panchmahal', description: 'Champaner-Pavagadh medieval fortifications and forest valleys.' },
      { name: 'Patan', description: 'Queen’s stepwell geometry and master Patola double-ikat silk weavers.' },
      { name: 'Porbandar', description: 'Limestone coastal architecture and tranquil flamingo wetlands.' },
      { name: 'Rajkot', description: 'Kathiawari craft guilds, silversmiths and historic town squares.' },
      { name: 'Sabarkantha', description: 'Polo forest medieval ruins submerged in ancient Aravali woodland.' },
      { name: 'Surat', description: 'Historic silk maritime docks and Tapi river estuaries.' },
      { name: 'Surendranagar', description: 'Gateway to the Little Rann, Indian wild ass sanctuary and weavers.' },
      { name: 'Tapi', description: 'Forested river basins, herbal medicine practitioners and tribal valleys.' },
      { name: 'Vadodara', description: 'Royal banyan corridors, botanical enclaves and heritage palaces.' },
      { name: 'Valsad', description: 'Mango groves, black-sand coastal villages and Sahyadri foothills.' }
    ])
  },
  {
    id: 'west-bengal',
    name: 'West Bengal',
    slug: 'west-bengal',
    tagline: 'Misty tea ridges, terracotta hamlets and coastal mangrove wilderness.',
    description: 'From high Himalayan villages in the shadows of Kanchenjunga to the quiet terracotta settlements of Rarh Bengal and the deltaic tides of the Sundarbans.',
    heroImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1600&q=80',
    districts: createDistricts('west-bengal', 'West Bengal', [
      {
        name: 'Darjeeling',
        description: 'Misty Himalayan hamlets, organic tea estates, Senchal pine forests and Kanchenjunga views.',
        heroImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80'
      },
      {
        name: 'Jalpaiguri',
        description: 'Teesta river reservoir, Dooars wetlands, tea gardens and Baikunthapur forest trails.',
        heroImage: 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1200&q=80'
      },
      {
        name: 'Alipurduar',
        description: 'Buxa Tiger Reserve, British-era hill fortress, Jayanti riverbed and Bhutan border trails.',
        heroImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80'
      },
      {
        name: 'Purba Bardhaman',
        slug: 'purba-bardhaman',
        aliases: ['bardhaman', 'burdwan'],
        description: 'Terracotta temples, 350-year-old aristocratic mansions, lotus dighis and bell-metal artisans.',
        heroImage: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=1200&q=80'
      },
      {
        name: 'Kalimpong',
        description: 'Orchid nurseries, Lepcha indigenous hamlets, silent river ridges and monastery trails.',
        heroImage: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80'
      },
      { name: 'Bankura', description: 'Bishnupur terracotta marvels, Dokra bell-metal artisans and Susunia hills.' },
      { name: 'Birbhum', description: 'Baul folk minstrels, red laterite soil trails, Shantiniketan artisan communes.' },
      { name: 'Cooch Behar', description: 'Koch dynasty royal architecture, tranquil palace tanks and Dooars plains.' },
      { name: 'Dakshin Dinajpur', description: 'Ancient archaeological mound settlements and pristine rural ponds.' },
      { name: 'Hooghly', description: 'Colonial riverbank settlements, terracotta temples and terracotta ghats.' },
      { name: 'Howrah', description: 'Historic botanical gardens, flower markets and riverine craft villages.' },
      { name: 'Jhargram', description: 'Dense Sal and Mahua forests, Lodha tribal culture and royal forest retreats.' },
      { name: 'Kolkata', description: 'Potters’ colony of Kumartuli, heritage printing presses and architectural lanes.' },
      { name: 'Malda', description: 'Medieval capitals of Gour and Pandua, silk weaving and mango orchards.' },
      { name: 'Murshidabad', description: 'Nawabi silk weaving, brassware, Hazarduari palace and Bhagirathi river.' },
      { name: 'Nadia', description: 'Sacred Chaitanya traditions, Shantipur handloom weavers and clay artisans.' },
      { name: 'North 24 Parganas', description: 'Mangrove estuarine edges, historical trade canals and bird sanctuaries.' },
      { name: 'Paschim Bardhaman', description: 'Forest-fringed reservoirs and ancient mineral heritage corridors.' },
      { name: 'Paschim Medinipur', description: 'Gongoni grand canyon of Bengal and Patachitra scroll painter villages.' },
      { name: 'Purba Medinipur', description: 'Untouched coastal dune beaches and estuarine fishing hamlets.' },
      { name: 'Purulia', description: 'Ayodhya hills, Chhau masked dance traditions and rugged rock outcrops.' },
      { name: 'South 24 Parganas', description: 'Sundarban mangrove waterways, honey gatherer lore and coastal islands.' },
      { name: 'Uttar Dinajpur', description: 'Kulikh bird sanctuary and traditional riverine market hamlets.' }
    ])
  },
  {
    id: 'rajasthan',
    name: 'Rajasthan',
    slug: 'rajasthan',
    tagline: 'Granite hills, pastoral nomadic routes and hidden desert wells.',
    description: 'Step past crowded palace tours into granite crags where Rabari shepherds live beside wild leopards, stepwells hidden in desert shrubs, and block-print villages.',
    heroImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1600&q=80',
    districts: createDistricts('rajasthan', 'Rajasthan', [
      { name: 'Pali', description: 'Jawai granite formations, Rabari pastoral life, leopard sanctuaries.' },
      { name: 'Barmer', description: 'Wood carving artisans, desert dunes, Meghwal embroidery traditions.' },
      { name: 'Bundi', description: 'Steep turquoise stepwells, miniature wall paintings and Taragarh ramparts.' },
      { name: 'Chittorgarh', description: 'Monumental hill fort bastion, quiet surrounding craft villages.' },
      { name: 'Jaisalmer', description: 'Deep Thar sandstone outposts, fossil woods and desert music lineages.' },
      { name: 'Udaipur', description: 'Aravalli tribal hills, hidden lakes and stone carver enclaves.' },
      { name: 'Jodhpur', description: 'Bishnoi eco-communes, wild blackbuck sanctuaries, potters.' },
      { name: 'Bikaner', description: 'Usta camel hide art, desert havelis and red sandstone monasteries.' },
      { name: 'Alwar', description: 'Ancient stepwells, tiger corridor valleys and Aravali ridge trails.' },
      { name: 'Shekhawati', description: 'Open-air frescoes, forgotten merchant havelis and desert roads.' }
    ])
  },
  {
    id: 'himachal-pradesh',
    name: 'Himachal Pradesh',
    slug: 'himachal-pradesh',
    tagline: 'High cold deserts, sacred cedar groves and stone-wood architecture.',
    description: 'Beyond Shimla and Manali lie high altitude Trans-Himalayan valleys, mud-brick monasteries clinging to crags, and Kath-Kuni wooden villages.',
    heroImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1600&q=80',
    districts: createDistricts('himachal-pradesh', 'Himachal Pradesh', [
      { name: 'Kinnaur', description: 'Apple blossom valleys, Kinnaur Kailash mountain vistas, slate architecture.' },
      { name: 'Lahaul and Spiti', description: 'Ancient Tibetan Buddhist monasteries, high fossil plateaus, cold desert serenity.' },
      { name: 'Chamba', description: 'Chamba Rumal embroidery, Pangi valley isolation and alpine meadows.' },
      { name: 'Kullu', description: 'Hidden Tirthan river valley, Great Himalayan National Park eco-trails.' },
      { name: 'Mandi', description: 'Prashar lake floating island, stone temples and quiet mountain farms.' },
      { name: 'Kangra', description: 'Dhauladhar slate hamlets, Kangra miniature painting and tea orchards.' },
      { name: 'Sirmaur', description: 'Renuka sacred wetland, fossil parks and terraced mountain villages.' }
    ])
  },
  {
    id: 'kerala',
    name: 'Kerala',
    slug: 'kerala',
    tagline: 'Western Ghat sholas, sacred groves and riverine indigenous forests.',
    description: 'Untangled from the tourist beaches are sacred Kavu groves, high altitude shola grasslands, spice-scented tribal settlements, and quiet river deltas.',
    heroImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1600&q=80',
    districts: createDistricts('kerala', 'Kerala', [
      { name: 'Wayanad', description: 'Ancient prehistoric edakkal petroglyphs, bamboo forests and tribal farmsteads.' },
      { name: 'Idukki', description: 'High misty Cardamom hills, shola evergreen canopies and indigenous tea gardens.' },
      { name: 'Palakkad', description: 'Silent Valley tropical rainforest, palmyra palm plains and granary villages.' },
      { name: 'Kannur', description: 'Ancient Theyyam ritual performances in village shrines, handloom weaving.' },
      { name: 'Kasaragod', description: 'Bekal coastal ramparts, serene backwater networks and coconut groves.' },
      { name: 'Pathanamthitta', description: 'Gavi rainforest wilderness, elephant corridors and Aranmula metal mirror craft.' }
    ])
  },
  {
    id: 'meghalaya',
    name: 'Meghalaya',
    slug: 'meghalaya',
    tagline: 'Living root bridges, cloud forests and limestone subterranean wonders.',
    description: 'High cloud plateaus where Khasi and Jaintia communities cultivate living fig root bridges, sacred forest groves, and pristine river canyons.',
    heroImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1600&q=80',
    districts: createDistricts('meghalaya', 'Meghalaya', [
      { name: 'East Khasi Hills', description: 'Sacred groves of Mawphlang, fossil ridges of Mawlyngbna, crystal streams.' },
      { name: 'West Jaintia Hills', description: 'Krang Shuri waterfalls, sacred monolith clusters and terraced paddy fields.' },
      { name: 'South Garo Hills', description: 'Balpakram canyon plateaus, limestone cave formations and pitcher plants.' },
      { name: 'Ri-Bhoi', description: 'Pine-scented lakes, organic pineapple farms and traditional sericulture.' }
    ])
  },
  {
    id: 'sikkim',
    name: 'Sikkim',
    slug: 'sikkim',
    tagline: 'Sacred lakes, rhododendron sanctuaries and organic mountain communes.',
    description: 'India’s first 100% organic state, sheltering sacred lakes nestled below Mt. Kanchenjunga, cardamom forests, and tranquil monastic retreats.',
    heroImage: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=1600&q=80',
    districts: createDistricts('sikkim', 'Sikkim', [
      { name: 'North Sikkim', description: 'Yumthang rhododendron valley, Gurudongmar high altitude sacred waters.' },
      { name: 'West Sikkim', description: 'Historic coronation throne of Yuksom, Dzongri mountain trails, silent gompas.' },
      { name: 'South Sikkim', description: 'Temi tea gardens, biodiversity reserves and quiet Lepcha homestays.' },
      { name: 'East Sikkim', description: 'Ancient Old Silk Route hairpins, mountain passes and alpine meadows.' }
    ])
  },
  {
    id: 'uttarakhand',
    name: 'Uttarakhand',
    slug: 'uttarakhand',
    tagline: 'Alpine bugyals, stone roof hamlets and Himalayan rivers.',
    description: 'Gentle Himalayan trails leading to highland meadows (bugyals), Kumaoni wooden carved homes, and tranquil river confluences.',
    heroImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1600&q=80',
    districts: createDistricts('uttarakhand', 'Uttarakhand', [
      { name: 'Pithoragarh', description: 'Kumaon frontier valleys, snow peaks of Panchachuli and alpine herb meadows.' },
      { name: 'Chamoli', description: 'Valley of flowers buffer zones, Nanda Devi biosphere hamlets and bugyals.' },
      { name: 'Bageshwar', description: 'Glacial Pindari trails, stone temples at river confluences and oak woods.' },
      { name: 'Rudraprayag', description: 'Tungnath alpine ridges, Deoriatal reflection lake and tranquil homestays.' },
      { name: 'Uttarkashi', description: 'Dayara Bugyal rolling grasslands, Harsil apple orchards and Bhagirathi banks.' }
    ])
  },
  {
    id: 'madhya-pradesh',
    name: 'Madhya Pradesh',
    slug: 'madhya-pradesh',
    tagline: 'Sal heartlands, prehistoric rock shelters and Gond tribal paintings.',
    description: 'Dense deciduous sal woodlands, prehistoric rock art older than civilization, and Gond tribal artists whose paintings celebrate the rhythm of the forest.',
    heroImage: 'https://images.unsplash.com/photo-1599827552599-ea9a039d93ee?auto=format&fit=crop&w=1600&q=80',
    districts: createDistricts('madhya-pradesh', 'Madhya Pradesh', [
      { name: 'Dindori', description: 'Heartland of Gond tribal painting, baiga forest dwellers and serene Narmada waters.' },
      { name: 'Raisen', description: 'Bhimbetka Stone Age cave shelters, Bhojpur massive lingam architecture.' },
      { name: 'Mandla', description: 'Kanha buffer forest villages, Baiga tribal hamlets and river bends.' },
      { name: 'Chhatarpur', description: 'Ken river canyon, Panna tiger corridors and secluded Bundelkhand retreats.' }
    ])
  },
  {
    id: 'odisha',
    name: 'Odisha',
    slug: 'odisha',
    tagline: 'Coastal mangrove sanctuaries, Dokra artisan villages and sacred handlooms.',
    description: 'Ancient Kalinga maritime lore, secluded Chilika wetland islands, artisan villages where every family paints Raghurajpur scrolls, and pristine beaches.',
    heroImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1600&q=80',
    districts: createDistricts('odisha', 'Odisha', [
      { name: 'Puri', description: 'Raghurajpur heritage craft village, Patachitra scrolls and tranquil mangrove coasts.' },
      { name: 'Kendrapara', description: 'Bhitarkanika estuarine crocodile sanctuary, mangrove delta labyrinths.' },
      { name: 'Koraput', description: 'Deomali high mountain crests, weekly tribal bazaars and coffee plantations.' },
      { name: 'Mayurbhanj', description: 'Similipal biosphere, Chhau martial dance troupes and indigenous sal trees.' }
    ])
  },
  {
    id: 'karnataka',
    name: 'Karnataka',
    slug: 'karnataka',
    tagline: 'Western Ghat coffee hills, Hoysala stone poetry and Deccan plains.',
    description: 'Hidden Hoysala stone temples carved in intricate chloritic schist, ancient Western Ghat rain forests, and Malnad coffee plantations.',
    heroImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1600&q=80',
    districts: createDistricts('karnataka', 'Karnataka', [
      { name: 'Chikkamagaluru', description: 'Bababudan giri coffee slopes, Mullayanagiri ridge trails and pristine sholas.' },
      { name: 'Hassan', description: 'Lesser-known Hoysala temples in Koravangala and Mosale, silent paddy basins.' },
      { name: 'Uttara Kannada', description: 'Yana limestone karst monoliths, Sharavathi valley waterfalls and quiet bays.' },
      { name: 'Kodagu', description: 'Coorg sacred groves, indigenous Kodava clans and spice forest estates.' }
    ])
  },
  {
    id: 'tamil-nadu',
    name: 'Tamil Nadu',
    slug: 'tamil-nadu',
    tagline: 'Chettinad mansion courtyards, Nilgiri sholas and temple sculptors.',
    description: 'Vast mansions built with Burma teak and Italian marble in rural Chettinad, secluded Toda tribal hamlets in the Nilgiris, and sacred bronze casting towns.',
    heroImage: 'https://images.unsplash.com/photo-1599827552599-ea9a039d93ee?auto=format&fit=crop&w=1600&q=80',
    districts: createDistricts('tamil-nadu', 'Tamil Nadu', [
      { name: 'Sivaganga', description: 'Chettinad heritage mansions, Athangudi handmade cement tile kilns, culinary roots.' },
      { name: 'Nilgiris', description: 'Toda buffalo pastures, endemic shola forests and silent mountain lakes.' },
      { name: 'Thanjavur', description: 'Swamimalai Chola bronze casting master craftsmen and Cauvery delta farms.' },
      { name: 'Theni', description: 'Suruli waterfalls, Western Ghat cardamom estates and quiet border passes.' }
    ])
  },
  {
    id: 'assam',
    name: 'Assam',
    slug: 'assam',
    tagline: 'River islands, golden Muga silk looms and Brahmaputra floodplains.',
    description: 'Majuli, the world’s largest river island with its Vaishnavite monasteries, the wild marshes of Kaziranga buffer zones, and golden Muga silk weavers.',
    heroImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1600&q=80',
    districts: createDistricts('assam', 'Assam', [
      { name: 'Majuli', description: 'Brahmaputra river island, Neo-Vaishnavite Satra culture and mask-making craft.' },
      { name: 'Dima Hasao', description: 'Haflong blue hills, Jatinga ridges and Dimasa tribal wooden hamlets.' },
      { name: 'Kamrup', description: 'Sualkuchi silk weaving capital where golden Muga silk is loomed by hand.' }
    ])
  },
  {
    id: 'arunachal-pradesh',
    name: 'Arunachal Pradesh',
    slug: 'arunachal-pradesh',
    tagline: 'Dawn-lit mountain borders, sacred valleys and tribal bamboo architectures.',
    description: 'Land of the dawn-lit mountains where Monpa, Apatani and Adi communities live in ecological harmony among snow ridges and pine canyons.',
    heroImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1600&q=80',
    districts: createDistricts('arunachal-pradesh', 'Arunachal Pradesh', [
      { name: 'Lower Subansiri', description: 'Ziro valley, UNESCO-nominated Apatani organic rice-cum-fish farming and pine ridges.' },
      { name: 'West Kameng', description: 'Sangti valley black-necked crane sanctuary, Dirang stone architecture.' },
      { name: 'Anjaw', description: 'Easternmost frontier of India, Dong valley first sunrise and pine trails.' }
    ])
  },
  {
    id: 'manipur',
    name: 'Manipur',
    slug: 'manipur',
    tagline: 'Floating lake phumdis, black pottery and sacred forest groves.',
    description: 'Loktak lake’s floating islands, Tangkhul black pottery in Longpi, and misty border hillocks of serene cultural resilience.',
    heroImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1600&q=80',
    districts: createDistricts('manipur', 'Manipur', [
      { name: 'Bishnupur', description: 'Loktak lake floating circular phumdis, Keibul Lamjao sangai sanctuary.' },
      { name: 'Ukhrul', description: 'Longpi serpentine stone black pottery craft, Shirui lily peaks.' }
    ])
  },
  {
    id: 'mizoram',
    name: 'Mizoram',
    slug: 'mizoram',
    tagline: 'Blue mountain ridges, bamboo forests and community brotherhood.',
    description: 'Emerald hill folds with high community unity (Tlawmngaihna), bamboo-crafted homes, and cloud-draped mountain passes.',
    heroImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1600&q=80',
    districts: createDistricts('mizoram', 'Mizoram', [
      { name: 'Champhai', description: 'Vineyard hills overlooking Myanmar, Rih Dil lake legend and pine ridges.' },
      { name: 'Aizawl', description: 'Quiet hilltop settlements, traditional handloom bazaars and cloud horizons.' }
    ])
  },
  {
    id: 'nagaland',
    name: 'Nagaland',
    slug: 'nagaland',
    tagline: 'Living green villages, ancestral warrior clans and mountain valleys.',
    description: 'Khonoma’s community-conserved green forests, Dzukou lily valleys, and ancestral Angami terrace farming systems.',
    heroImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1600&q=80',
    districts: createDistricts('nagaland', 'Nagaland', [
      { name: 'Kohima', description: 'Khonoma Asia’s first green village, alder-based sustainable agriculture.' },
      { name: 'Mon', description: 'Konyak ancestral longhouses, brass bead artisans and misty border hills.' }
    ])
  },
  {
    id: 'tripura',
    name: 'Tripura',
    slug: 'tripura',
    tagline: 'Rock-cut holy reliefs, lake palaces and bamboo craft guilds.',
    description: 'Unakoti’s massive Bas-relief rock carvings hidden in forest hills, floating water palaces, and exquisite bamboo handicrafts.',
    heroImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1600&q=80',
    districts: createDistricts('tripura', 'Tripura', [
      { name: 'Unakoti', description: 'Ancient monumental rock-carved Shaivite faces sculpted along deep jungle streams.' },
      { name: 'Sepahijala', description: 'Clouded leopard sanctuary, rubber plantations and serene lakes.' }
    ])
  },
  {
    id: 'goa',
    name: 'Goa',
    slug: 'goa',
    tagline: 'Spice valleys, Western Ghat waterfalls and ancestral backwater islands.',
    description: 'Far away from crowded tourist beaches: Divar Island backwaters, Netravali bubbling lakes, and Sahyadri spice plantations.',
    heroImage: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=1600&q=80',
    districts: createDistricts('goa', 'Goa', [
      { name: 'North Goa', description: 'Divar Island ferry crossings, Chorão mangrove bird sanctuaries, spice plantations.' },
      { name: 'South Goa', description: 'Netravali bubbling lake, Cotigao tree canopies, secluded stone stepwells.' }
    ])
  },
  {
    id: 'maharashtra',
    name: 'Maharashtra',
    slug: 'maharashtra',
    tagline: 'Sahyadri basalt fortresses, sacred forest groves and coastal Konkan.',
    description: 'Ancient rock-cut Buddhist caves hidden in misty Sahyadri folds, quiet Konkan red-tile villages, and sacred Devrai forest sanctuaries.',
    heroImage: 'https://images.unsplash.com/photo-1599827552599-ea9a039d93ee?auto=format&fit=crop&w=1600&q=80',
    districts: createDistricts('maharashtra', 'Maharashtra', [
      { name: 'Sindhudurg', description: 'Konkan coastal forts, Malvani cuisine, backwater mangroves and wooden toy makers.' },
      { name: 'Satara', description: 'Kaas UNESCO plateau of wild seasonal flowers, Koyna valley forest trails.' },
      { name: 'Ratnagiri', description: 'Ancient petroglyph stone drawings, Alphonso orchards and secluded sea cliffs.' },
      { name: 'Palghar', description: 'Warli indigenous painting communes and Jawhar tribal palace ruins.' }
    ])
  },
  {
    id: 'chhattisgarh',
    name: 'Chhattisgarh',
    slug: 'chhattisgarh',
    tagline: 'Bastar bell-metal artisans, Chitrakote horseshoe cascades and Sal forests.',
    description: 'Ancient tribal weekly haats, lost-wax bronze casting traditions, subterranean limestone caves, and wide river cataracts.',
    heroImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1600&q=80',
    districts: createDistricts('chhattisgarh', 'Chhattisgarh', [
      { name: 'Bastar', description: 'Chitrakote horseshoe waterfall, Dokra brass sculptors and terracotta shrines.' },
      { name: 'Dantewada', description: 'Bailadila scenic ridges, Dholkal Ganesha mountain summit, tribal culture.' }
    ])
  },
  {
    id: 'jharkhand',
    name: 'Jharkhand',
    slug: 'jharkhand',
    tagline: 'Sohrai mural villages, Netarhat pine plateaus and sacred waterfalls.',
    description: 'Hazaribagh villages adorned with indigenous Sohrai and Khovar painted walls, dense sal valleys, and serene highland plateaus.',
    heroImage: 'https://images.unsplash.com/photo-1599827552599-ea9a039d93ee?auto=format&fit=crop&w=1600&q=80',
    districts: createDistricts('jharkhand', 'Jharkhand', [
      { name: 'Hazaribagh', description: 'Indigenous Sohrai mural painter villages, forest rock art caves of Isco.' },
      { name: 'Latehar', description: 'Netarhat Queen of Chotanagpur, Magnolia point sunsets and pine trails.' }
    ])
  },
  {
    id: 'bihar',
    name: 'Bihar',
    slug: 'bihar',
    tagline: 'Ancient Nalanda scholastic ruins, Madhubani artisan courtyards and mango groves.',
    description: 'Explore the heartland where Buddhist universities once taught the ancient world, villages where every home paints Madhubani legends, and tranquil mango orchards.',
    heroImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1600&q=80',
    districts: createDistricts('bihar', 'Bihar', [
      { name: 'Madhubani', description: 'Ranti and Jitwarpur villages where master women artists preserve Mithila wall painting.' },
      { name: 'Nalanda', description: 'Ruins of the world’s first residential university, Rajgir bamboo groves.' },
      { name: 'Rohtas', description: 'Massive Rohtasgarh hill fort, Kaimur waterfall canyons and stone steps.' }
    ])
  },
  {
    id: 'uttar-pradesh',
    name: 'Uttar Pradesh',
    slug: 'uttar-pradesh',
    tagline: 'Ancient clay pottery towns, Bundelkhand fortresses and Terai forests.',
    description: 'Venture beyond the Taj Mahal to Nizamabad black pottery kilns, Dudhwa’s wild Terai swamp deer marshes, and Chunar stone-carver ghats.',
    heroImage: 'https://images.unsplash.com/photo-1599827552599-ea9a039d93ee?auto=format&fit=crop&w=1600&q=80',
    districts: createDistricts('uttar-pradesh', 'Uttar Pradesh', [
      { name: 'Azamgarh', description: 'Nizamabad black clay pottery decorated with silver zinc floral engravings.' },
      { name: 'Lakhimpur Kheri', description: 'Dudhwa National Park, pristine Terai grassland sal forest and Tharu tribal life.' },
      { name: 'Lalitpur', description: 'Ancient Gupta period Dashavatara stone temple and Betwa river banks.' }
    ])
  },
  {
    id: 'punjab',
    name: 'Punjab',
    slug: 'punjab',
    tagline: 'Tranquil canal farmlands, Phulkari needlecraft and sacred wetlands.',
    description: 'Vast golden wheat and mustard fields crisscrossed by historic canals, rural Harike wetland flyways, and Phulkari embroidery artisans.',
    heroImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1600&q=80',
    districts: createDistricts('punjab', 'Punjab', [
      { name: 'Tarn Taran', description: 'Harike Pattan confluence wetland, winter migratory birds and historic gurudwaras.' },
      { name: 'Hoshiarpur', description: 'Shivalik foothills, wooden inlay artisans and fragrant citrus orchards.' }
    ])
  },
  {
    id: 'haryana',
    name: 'Haryana',
    slug: 'haryana',
    tagline: 'Morni Shivalik pine hills, Sultanpur migratory lakes and stepwells.',
    description: 'Serene pine ridges at Morni Hills, ancient Indus Valley excavation mounds at Rakhigarhi, and quiet agricultural stepwells.',
    heroImage: 'https://images.unsplash.com/photo-1599827552599-ea9a039d93ee?auto=format&fit=crop&w=1600&q=80',
    districts: createDistricts('haryana', 'Haryana', [
      { name: 'Panchkula', description: 'Morni Hills pine forest trails, Tikkar Taal lakes and ancient fortresses.' },
      { name: 'Hisar', description: 'Rakhigarhi Harappan archaeological wonders and historic Firoz Shah stepwells.' }
    ])
  },
  {
    id: 'andhra-pradesh',
    name: 'Andhra Pradesh',
    slug: 'andhra-pradesh',
    tagline: 'Eastern Ghat coffee valleys, Kalamkari craft and Gandikota gorges.',
    description: 'The dramatic red rock canyon of Gandikota over the Penna river, Araku valley tribal organic coffee groves, and hand-block Kalamkari guilds.',
    heroImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1600&q=80',
    districts: createDistricts('andhra-pradesh', 'Andhra Pradesh', [
      { name: 'YSR Kadapa', description: 'Gandikota Grand Canyon of India, Belum underground cave labyrinths.' },
      { name: 'Alluri Sitharama Raju', description: 'Araku valley coffee plantations, Borra caves and indigenous tribal culture.' }
    ])
  },
  {
    id: 'telangana',
    name: 'Telangana',
    slug: 'telangana',
    tagline: 'Kakatiya stone gateways, Pochampally ikat looms and basalt hill forts.',
    description: 'Intricate 1,000-pillar stone temple architecture, master Pochampally ikat weavers in tranquil rural weaver hamlets, and rocky Deccan hill forts.',
    heroImage: 'https://images.unsplash.com/photo-1599827552599-ea9a039d93ee?auto=format&fit=crop&w=1600&q=80',
    districts: createDistricts('telangana', 'Telangana', [
      { name: 'Yadadri Bhuvanagiri', description: 'Pochampally heritage ikat silk weaving commune and Bhongir monolithic rock fort.' },
      { name: 'Mulugu', description: 'UNESCO Ramappa temple floating lightweight bricks, Laknavaram hanging rope bridge.' }
    ])
  }
];
