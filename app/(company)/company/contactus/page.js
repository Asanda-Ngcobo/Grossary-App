import { Mail, MapPin, MessageCircle } from "@deemlol/next-icons";

function ContactUsPage() {
    return (
        <div className="w-[90%] h-[100vh] mx-auto flex flex-col z-0 top-10">
            <div>
                <h1 className="text-4xl">Get in touch</h1>
                <p className="mt-8 max-w-3xl text-lg leading-8 text-zinc-600 sm:text-xl">Need help with anything or want
                     to report any errors? feel free to contact us</p>

            </div>
            <div className="w-full mx-auto flex flex-col
             md:flex-row gap-5 justify-between">

                <div className="md:w-1/3 w-full
                 mx-auto flex gap-2
                flex-col md:flex-row p-3 rounded-2xl">
                <div className="px-2 py-1">
                    <MessageCircle/>
                </div>
             <h1 className="text-lg px-2 py-1 1 text-gray-400">WhatsApp</h1>
                <p className="px-2 py-1">
                    +27 72 124 7120
                </p>
                </div>

               
                <div className="md:w-1/3 w-full
                 mx-auto flex gap-2
                flex-col md:flex-row p-3 rounded-2xl">
                <div className="px-2 py-1">
                    <Mail/>
                </div>
             <h1 className="text-lg px-2 py-1 1 text-gray-400">Email</h1>
                <p className="px-2 py-1">
                    support@grossary.shop
                </p>
                </div>

                  <div  className="md:w-1/3 w-full
                 mx-auto flex gap-2
                flex-col md:flex-row p-3 rounded-2xl">
                <div className="px-2 py-1">
                    <MapPin/>
                </div>
                <h1 className="text-lg px-2 py-1 1 text-gray-400">Address</h1>
                <p className="px-2 py-1">
                    10 Youngs Avenue, Musgrave, Durban, 4001
                </p>
                </div>

            </div>
        </div>
    )
}

export default ContactUsPage;