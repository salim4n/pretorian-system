import PriceCard from './components/PriceCard'
import Image from 'next/image'

export default function Home() {
  return (
      <>
        <section className="lg:flex">
        <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:h-screen lg:items-center lg:w-1/2">
          <div className="mx-auto max-w-xl text-center">
            <h1 className="text-3xl font-extrabold sm:text-5xl">
              Laissez nous vous protéger avec
              <strong className="font-extrabold  sm:block"> le système Pretorian</strong>
            </h1>

            <p className="mt-4 sm:text-xl/relaxed">
              Notre système Pretorian utilise l'intelligence artificielle pour <strong>detecter les intrusions dans votre domicile ou votre entreprise
              offrant une protection sans précédent contre les intrusions</strong>.
              Commencez dès aujourd'hui et donnez à votre domicile ou à votre entreprise la protection qu'ils méritent.
            </p>
          </div>
        </div>
        <div className="lg:w-1/2">
          <Image
            src="/centurion.png" 
            alt="Description of image" 
            className="w-full h-full object-cover border-8 border-gray-200 rounded-lg" 
            layout="responsive"
            width={600}
            height={600}
            />
        </div>
      </section>
      <section className="lg:flex">
        <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:h-screen lg:items-center lg:w-1/2">
          <div className="mx-auto max-w-xl text-center">
            <h1 className="text-3xl font-extrabold sm:text-5xl">
              Comment fonctionne 
              <strong className="font-extrabold  sm:block"> le système Pretorian ?</strong>
            </h1>

            <p className="mt-4 sm:text-xl/relaxed">
              Notre système Pretorian est une application web boosté par Vision par Ordinateur. 
              <strong>Vous avez juste à vous connecter sur notre application web depuis un ordinateur avec une connection internet, branchez des caméra usb sur votre ordinateur,
                ou connectez des camera wifi ou bluetooth, et nous nous occupons du reste.</strong>
            </p>
          </div>
        </div>
        <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:h-screen lg:items-center lg:w-1/2">
          <div className="mx-auto max-w-xl text-center">
            <h1 className="text-3xl font-extrabold sm:text-5xl">
              OK et après ?
            </h1>

            <p className="mt-4 sm:text-xl/relaxed">
              Nous vous notifions chaque detection d'intrusion en temps réel, et vous pouvez voir les images de la caméra en temps réel.
                <strong>Vous pouvez aussi voir les images des caméras enregistrées, et les télécharger sur votre ordinateur.</strong>
                Et avec l'application Telegram, vous pouvez tout faire depuis votre téléphone.
            </p>
          </div>
        </div>
      </section>
      <div className="max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16 content-center">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:items-stretch md:grid-cols-3 md:gap-8">
                <PriceCard
                    title="Mensuel sans engagement"
                    price={14.99}
                    features={["detection d'intrusion", "notifications en temps réel", "images enregistrées"]}
                    description="Parfait pour les appartements, maisons ou commerces"
                 />
                <PriceCard
                    title="Mensuel avec engagement 1 an"
                    price={9.99}
                    features={["detection d'intrusion", "notifications en temps réel", "images enregistrées"]}
                    description="Parfait pour les appartements, maisons ou commerces"
                 />
                <PriceCard
                    title="Entreprise"
                    price={99.99}
                    features={["detection d'intrusion", "notifications en temps réel", "images enregistrées","images en temps réel", "deploiement sur plusieurs sites", "support 24/7","integration avec votre système de sécurité existant","Intelligence Artificielle personnalisée"]}
                    description="Parfait pour les grandes entreprises ou les pro ayant des besoins particuliers"
                 />
              </div>
          </div>
        </>


    )
}