import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => [
  { title: "Gizlilik ve Güvenlik Koşulları – Fizikfinito" },
  {
    name: "description",
    content:
      "Fizikfinito’da gizlilik ve güvenlik koşullarını, kullanım şartlarını ve bu siteyi kullanırken kabul etmiş olduğunuz hüküm ve koşulları inceleyin.",
  },
];

export default function PrivacyAndSecurity() {
  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Gizlilik ve Güvenlik Koşulları</h1>

      <ol className="list-decimal list-inside space-y-4">
        <li>
          <strong>Genel:</strong> Bu siteyi kullanıyor olmanız, gizlilik ve güvenlik koşullarını ve kurallarını okuduğunuz ve kabul ettiğiniz anlamına gelir. Gizlilik koşullarında öngörülen zorunlulukları yerine getiremeyeceğinizi düşünüyorsanız, bu siteyi kullanmayınız. Sitedeki bazı yerlerin kullanımı veya bu yerlerle kurulacak etkileşim hakkında özel birtakım ek hüküm ve şartlar geçerli olabilir.
        </li>

        <li>
          <strong>Gizlilik ve Güvenlik Koşullarının Takibi/Değişiklik:</strong> fizikfinito.com (“Site Sahibi”), herhangi bir zamanda önceden haber vermeksizin gizlilik ve güvenlik koşullarında değişiklik yapma ya da ek koşullar getirme hakkına sahiptir. Kullanım sırasında toplanan bilgilerin niteliklerinden, nasıl kullanıldığından, bu bilgilerin diğerleri ile hangi durumlarda paylaşıldığından ve gerekli tüm gizlilik koşullarından haberdar olunması için yapılan değişiklikler bu sayfada sunulacaktır. Site sahibinin gizlilik koşullarında değişiklik yapma hakkı saklı olduğundan, koşullarının düzenli olarak takibi ve okunması gereklidir. Bu siteyi yapılabilecek bu tarz bir değişiklikten sonraki kullanım, gizlilik koşullarındaki değişiklilerin kabul edildiği anlamını taşır.
        </li>

        <li>
          <strong>Açık Sistem:</strong> Kullanıcılar; (Kullanıcı tabiri, varsa üyeler dahil, web sitesine giren herkesi ifade eden genel bir tanım olarak kullanılmıştır.) internet ortamının güvenilir bir ortam olmadığını, internet ortamında iletişimin riskli olduğunu, kişisel bilgiler, şifreler vb. de dâhil her türlü bilginin 3. şahısların hukuka aykırı fiillerinin muhatabı olabileceğini bilmekte ve kabul etmektedir. Site sahibi, güvenlik ve kötü niyetli hareketlerle ilgili olarak hiçbir garanti vermemektedir.
        </li>

        <li>
          <strong>Kullanıcı Adı ve Şifre:</strong> Site sahibi bazı bölümlerin kullanımını üyelik/kayıt şartına bağlı tutabilir. Kayıt sırasında Kullanıcıya ad ve şifre verilebilir ya da kullanıcı tarafından ad ve şifre oluşturulması istenebilir. Kullanıcı adı ve şifrenin muhafazasından, yanlış ya da hukuka aykırı kullanımından ve olası tüm izinsiz kullanımlardan doğrudan kullanıcı sorumludur. Şifrenin özel rakamlar, harfler ve karakterler kullanılarak daha güvenli bir biçimde oluşturulmasından ya da bunun için gerekli değişikliklerin yapılmasından kullanıcı sorumludur. Üyelik adı ve şifre kullanılarak yapılan tüm işlemlerin sorumluluğu kullanıcıya aittir. Üye adı ve şifrenin kaybedilmesi, yetkisiz 3. şahısların eline geçmesi ya da üye güvenliğini tehdit eden bir durumla karşılaşılması halinde derhal site ve/veya site sahibine haber verilir.
        </li>

        <li>
          <strong>Bilgilerin Korunması:</strong> Site sahibi, web sitesindeki tüm sayfaların güvenliği için azami gayret göstermektedir. Sitede kayıtlı bulunan verilerin gizliliğini, güvenliğini ve bütünlüğünü korumak için çok çeşitli teknik ve yönetimsel uygulamalardan yararlanılmaktadır.
        </li>

        <li>
          <strong>Üçüncü Kişilere Ait Siteler:</strong> Bu sitede, site sahibinin işletmediği veya işletimini kontrol etmediği, 3. şahıslar tarafından işletilen alt ve üst siteler bulunabilir ve bunlara bağlantı sağlanabilir. Site sahibinin bu sitelere ilişkin içerik, güvenlik, gizlilik politikaları ve kesintisiz erişim konusunda hiçbir garantisi yoktur. Sorumluluk, ilgili üçüncü taraf sitelerdeki hüküm ve koşullara tabidir.
        </li>

        <li>
          <strong>Site Yardımcı Programları:</strong> Kullanıcının sitenin bazı bölümlerinden yararlanabilmesi için yardımcı programlar kullanılabilir. Bu bölümlerden yararlanıldığında, kullanım biçim ve kapsamıyla ilgili veriler site veritabanına kaydedilebilir. Ayrıca, kullanıcı deneyimini iyileştirmek için çerezler kullanılabilir.
        </li>

        <li>
          <strong>Kişisel Bilgiler:</strong>
          <ol className="list-decimal list-inside ml-6 mt-2 space-y-2">
            <li>
              Sitenin ziyaret edilmesi, kullanılması ya da herhangi bir bölümden yararlanılması için ad, soyad, adres, IP bilgileri, e-posta adresi, telefon numarası vb. kişisel bilgiler siteye verilmiş, kaydedilmiş olur. Kullanıcı, bu bilgilerin site sahibine karşı gizliliğini yitirdiğini kabul eder.
            </li>
            <li>
              Site sahibi, kullanıcı tarafından verilen bilgileri mevzuata uygun olarak yurt içinde veya yurt dışında saklayabilir ve işleyebilir. Kullanıcı, bu konuda izin vermiş sayılır.
            </li>
            <li>
              <strong>Hassas Bilgiler:</strong> Site sahibi yasaların öngörmediği sürece; ırk, etnik kimlik, dini/siyasi düşünce, sağlık durumu gibi hassas bilgiler talep etmez.
            </li>
            <li>
              Siteye üye ticari firma bilgileri de kişisel veri hükümlüğüne tabidir.
            </li>
          </ol>
        </li>

        <li>
          <strong>Kişisel Verilerinizin Kullanımı:</strong> Verilen izin; hizmet sunumu, tanıtım faaliyetleri ve hukuki yükümlülükler gibi amaçlarla kişisel verilerin kullanılmasını kapsar.
        </li>

        <li>
          <strong>Ticari İletişim:</strong> Site, iletişim adresinize ticari elektronik ileti gönderebilir. İletilere ilişkin rıza iptal talepleri en geç 5 iş günü içinde işleme alınacaktır.
        </li>

        <li>
          <strong>Gizlilik ve Güvenlik Koşullarının İhlali:</strong> Kuralların ihlali durumunda, site sahibi kullanıcıya önceden bildirimde bulunmaksızın erişimi askıya alma, sonlandırma veya içerik silme hakkına sahiptir.
        </li>

        <li>
          <strong>Bilgi ve İletişim:</strong> Gizlilik koşulları ile ilgili sorularınızı fizikfinito.com adresindeki "Öneriniz mi var?" bölümünden iletebilirsiniz.
        </li>
      </ol>

      <p className="mt-8">
        <Link to="/" className="text-blue-600 dark:text-blue-400 underline">
          Ana Sayfa
        </Link>{" "}
        'ya geri dönmek için tıklayın.
      </p>
    </div>
  );
}
