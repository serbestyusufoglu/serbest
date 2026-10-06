import { TarihBelgesi } from '@/types';

export interface BelgeSeti {
  id: string;
  ad: string;
  donem: string;
  aciklama: string;
  belgeler: TarihBelgesi[];
  ornekSorular: string[];
}

export const ORNEK_BELGE_SETLERI: BelgeSeti[] = [
  {
    id: 'amasya-havza',
    ad: 'Amasya Genelgesi ve Havza Bildirisi (1919)',
    donem: 'Haziran 1919',
    aciklama: 'Millî Mücadele\'nin amaç, gerekçe ve yöntemini belirleyen ilk resmî ihtilal belgesi ve protesto tamimleri.',
    ornekSorular: [
      'Amasya Genelgesi\'ne göre vatanın kurtuluşu hangi güçle sağlanacaktır?',
      'Mustafa Kemal Paşa Havza\'da halktan ve mülki amirlerden ne yapmalarını istemiştir?',
      'Milletin bağımsızlığını tehlikede gören gerekçe belgede nasıl ifade edilmiştir?',
      'Belgelerde Osmanlı Hükûmeti\'nin durumu hakkında ne söyleniyor?'
    ],
    belgeler: [
      {
        id: 'amasya-1',
        etiket: 'Belge 1',
        baslik: 'Amasya Genelgesi (22 Haziran 1919) - İhtilal Beyannamesi',
        tarih: '22 Haziran 1919',
        kaynak: 'Harp Tarihi Vesikaları Dergisi & Nutuk Belge No: 26',
        icerik: `1. Vatanın bütünlüğü, milletin bağımsızlığı tehlikededir.
2. İstanbul Hükûmeti, üzerine aldığı sorumluluğun gereklerini yerine getirememektedir. Bu durum milletimizi yok olmuş gibi göstermektedir.
3. Milletin bağımsızlığını, yine milletin azim ve kararı kurtaracaktır.
4. Milletin durumunu göz önünde tutmak ve haklarını dile getirip bütün dünyaya duyurmak için her türlü denetimden uzak millî bir heyetin varlığı zaruridir.
5. Anadolu'nun her bakımdan en güvenilir yeri olan Sivas'ta millî bir kongrenin acele toplanması kararlaştırılmıştır.
6. Bunun için bütün vilayetlerin her sancağından milletin güvenini kazanmış üçer temsilcinin mümkün olan süratle yetişmek üzere hemen yola çıkarılması gerekmektedir.
7. Her ihtimale karşı bu mesele millî bir sır halinde tutulmalı ve temsilciler gereken yerlere adlarını gizleyerek gelmelidirler.`
      },
      {
        id: 'havza-2',
        etiket: 'Belge 2',
        baslik: 'Havza Bildirisi (28 Mayıs 1919) - İlk Direniş Genelgesi',
        tarih: '28 Mayıs 1919',
        kaynak: 'Atatürk\'ün Tamim, Telgraf ve Beyannameleri',
        icerik: `İzmir'in ve maalesef Manisa ve Aydın'ın işgali gelecekteki tehlikeyi daha açık göstermektedir.
Yurdun bütünlüğü ve milletin bağımsızlığını koruma yolundaki millî heyecan ve gayretin gittikçe daha canlı bir şekilde tecelli etmesi gerekmektedir.
Bunun için valilik ve mutasarrıflıklara bildirilir ki:
Mitingler tertip edilerek milletin haksız işgallere karşı protestoları İtilaf Devletleri temsilcilerine ve İstanbul Hükûmeti'ne telgraflarla ulaştırılmalıdır.
Mitingler düzenlenirken ve telgraflar çekilirken Hristiyan ahalisine karşı hiçbir taşkınlık ve düşmanlık yapılmamalı, asayiş katiyetle bozulmamalıdır.`
      },
      {
        id: 'amasya-3',
        etiket: 'Belge 3',
        baslik: 'Mustafa Kemal Paşa\'nın Amasya\'dan Kazım Karabekir Paşa\'ya Şifreli Telgrafı',
        tarih: '23 Haziran 1919',
        kaynak: 'Nutuk, Belge 27',
        icerik: `Artık İstanbul Anadolu'ya hâkim değil, tâbi olmak mecburiyetindedir.
Burada müttefikan verilen kararlar şunlardır:
Yalnız mitingler ve nümayişlerle büyük gayeler istihsal edilemez. Bunlar ancak uyanıklık vesilesidir.
Esas olan, milletin teşkilatlanması ve vatan müdafaasında fiilen mukavemet iradesini ortaya koymasıdır.
Sivas Kongresi için her taraftan murahhasların süratle sevki temin olunmalıdır.`
      }
    ]
  },
  {
    id: 'erzurum-sivas',
    ad: 'Erzurum ve Sivas Kongresi Kararları (1919)',
    donem: 'Temmuz - Eylül 1919',
    aciklama: 'Manda ve himayenin kesin olarak reddedildiği, millî sınırların ve Temsil Heyeti\'nin kurulduğu kongre zabıtları.',
    ornekSorular: [
      'Manda ve himaye konusunda kongrelerde ne karar alınmıştır?',
      'Millî sınırlar belgede hangi ifadeyle çizilmiştir?',
      'Kuvâ-yı Millîye\'yi amil, irâde-i milliyeyi hâkim kılmak ne anlama gelmektedir?'
    ],
    belgeler: [
      {
        id: 'erzurum-1',
        etiket: 'Belge 1',
        baslik: 'Erzurum Kongresi Kararları (7 Ağustos 1919)',
        tarih: '7 Ağustos 1919',
        kaynak: 'Erzurum Kongresi Zabıtları',
        icerik: `1. Millî sınırlar içinde vatan bir bütündür, birbirinden ayrılamaz.
2. Her türlü yabancı işgal ve müdahalesine karşı, Osmanlı Hükûmeti\'nin dağılması halinde, millet topyekûn kendisini savunacak ve direnecektir.
3. İstanbul Hükûmeti vatanı koruma ve bağımsızlığı temin etme gücünü gösteremezse, geçici bir hükûmet kurulacaktır. Bu hükûmet üyeleri millî kongrece seçilecektir.
4. Kuvâ-yı Millîye\'yi tek kuvvet tanımak ve millî iradeyi hâkim kılmak esastır.
5. Hristiyan unsurlara siyasî hâkimiyet ve içtimaî dengemizi bozacak imtiyazlar verilemez.
6. Manda ve himaye kabul olunamaz.
7. Mebuslar Meclisi\'nin derhal toplanması ve hükûmet icraatının meclis denetimine sunulması mecburidir.`
      },
      {
        id: 'sivas-2',
        etiket: 'Belge 2',
        baslik: 'Sivas Kongresi Beyannamesi (11 Eylül 1919)',
        tarih: '11 Eylül 1919',
        kaynak: 'Sivas Kongresi Tutanakları',
        icerik: `1. 30 Ekim 1918 Mondros Mütarekesi imzalandığı tarihteki sınırlarımız içinde kalan vatan parçaları bir bütündür; hiçbir sebeple birbirinden ayrılamaz.
2. Vatanımızın parçalanması tehlikesine karşı kurulmuş olan bütün millî cemiyetler "Anadolu ve Rumeli Müdafaa-i Hukuk Cemiyeti" adı altında birleştirilmiştir.
3. Millî iradeyi temsil etmek üzere seçilen Heyet-i Temsiliye, bütün vatanı temsil eder.
4. Manda ve himaye fikri kesin surette ve bir daha açılmamak üzere reddedilmiştir.
5. İrâde-i Milliye adıyla bir gazete çıkarılarak davanın hakikati halka ve dünyaya duyurulacaktır.`
      }
    ]
  },
  {
    id: 'misak-i-milli',
    ad: 'Misak-ı Millî (Millî Ant) Kararları (1920)',
    donem: 'Ocak 1920',
    aciklama: 'Son Osmanlı Mebusan Meclisi\'nde kabul edilen ve Türkiye Cumhuriyeti\'nin bağımsızlık ve sınır pusulası olan 6 maddelik ahidname.',
    ornekSorular: [
      'Kapitülasyonlar hakkında Misak-ı Millî\'de ne söylenmiştir?',
      'Boğazların durumu hangi şarta bağlanmıştır?',
      'Arap toprakları ve Batı Trakya için nasıl bir çözüm öngörülmüştür?'
    ],
    belgeler: [
      {
        id: 'misak-1',
        etiket: 'Belge 1',
        baslik: 'Misak-ı Millî Beyannamesi (28 Ocak 1920)',
        tarih: '28 Ocak 1920',
        kaynak: 'Meclis-i Mebusan Zabıt Ceridesi',
        icerik: `Madde 1: 30 Ekim 1918 Mütarekesi çizgisinin içinde ve dışında kalan, dinen ve ırkan birleşmiş Osmanlı-İslam çoğunluğunun yerleşmiş bulunduğu kısımların tümü hakikaten bölünmez bir bütündür.
Madde 2: Halkı ilk serbest kaldıkları zamanda oylarıyla anavatana katılmış olan üç liva (Kars, Ardahan, Batum) için gerekirse tekrar serbestçe halkoyuna başvurulmalıdır.
Madde 3: Batı Trakya\'nın hukuki durumunun tespiti de ahalisinin tam bir hürriyet içinde verecekleri oylara uygun olmalıdır.
Madde 4: Hilafet ve saltanat merkezi olan İstanbul şehri ve Marmara Denizi\'nin güvenliği her türlü tehlikeden uzak tutulmalıdır. Boğazların dünya ticaretine açılması ilgili devletlerin oybirliğiyle vereceği karara bağlıdır.
Madde 5: Azınlıkların hakları, komşu memleketlerdeki Müslüman ahalinin de aynı haklardan yararlanması şartıyla güvence altına alınacaktır.
Madde 6: Millî ve iktisadi gelişmemizi temin etmek amacıyla siyasî, adlî ve malî gelişmemize engel olan sınırlamalar (kapitülasyonlar) kesinlikle kaldırılmalıdır.`
      },
      {
        id: 'misak-2',
        etiket: 'Belge 2',
        baslik: 'İstanbul\'un Resmen İşgali ve Mustafa Kemal Paşa\'nın Protestosu',
        tarih: '16 Mart 1920',
        kaynak: 'Nutuk, Belge 243',
        icerik: `Bugün sabaha karşı İngiliz kuvvetleri İstanbul'da Şehzadebaşı karakolunu basarak silahsız askerlerimizi şehit etmiş, Mebusan Meclisi'ni dağıtarak milletvekillerini tutuklamıştır.
Bu cürüm, doğrudan doğruya Türk milletinin hâkimiyetine ve hürriyetine indirilmiş bir darbedir.
Bütün İtilaf Devletleri parlamentolarına, dışişleri bakanlıklarına ve tarafsız memleketlere protestolar çekilmiştir.
Millet, bu tecavüz karşısında boyun eğmeyecek, Ankara'da olağanüstü yetkilere sahip yeni bir meclis toplayacaktır.`
      }
    ]
  }
];
