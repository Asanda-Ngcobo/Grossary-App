import Link from "next/link"
import AboutHero from "./AboutHero"

function page() {
    return (
        <>
        <AboutHero/>
        <main className="px-6 py-10 max-w-4xl mx-auto text-gray-800">
            
      <h1 className="text-4xl font-bold mb-6">No missed grocery items.
         No overspending. Just smarter shopping</h1>

      <p className="mb-4 text-lg">
        Grossary is your smart grocery planning companion, designed to help students, young professionals and busy individuals stay on top of their shopping without overspending or missing out on essentials. We simplify how you plan, track, and budget for groceries.
      </p>

      <p className="mb-4 text-lg">
        Whether you are a new graduate adjusting to financial independence or a parent managing a household, Grossary gives you the tools to make grocery shopping efficient, affordable, and stress-free.
      </p>

      <p className="mb-8 text-lg">
        With features like automatic category sorting, price tracking, and store recommendations based on your budget and location, Grossary helps you make smarter, faster decisions.
      </p>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Why We Built Grossary</h2>
        <ul className="list-disc list-inside space-y-2 text-lg">
          <li>To help you avoid unnecessary overspending</li>
          <li>To save time and stress during grocery runs</li>
          <li>To offer better budgeting for students, parents, and professionals</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Student Testimonial</h2>
        <blockquote className="border-l-4 border-[#A2B06D] pl-4 italic text-gray-700 text-lg">
          “As a university student on a tight NSFAS budget, Grossary has become my weekly lifesaver.
          I just input my list, and it tells me where to shop without going over budget.
          It’s like having a personal shopper that actually understands my financial situation.”
        </blockquote>
        <p className="mt-2 text-sm text-gray-600">— Zanele M., 3rd-year student at UKZN</p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Start Using Grossary</h2>
        <p className="text-lg mb-4">
          Sign up on the web and start managing your grocery list like a pro.
          It is free to get started, and you will save more than just money.
        </p>
        <Link href="/signup" className="inline-block bg-[#A2B06D] text-white px-6 py-3 rounded hover:bg-green-700">
          Get Started
        </Link>
      </section>
    </main>
    </>
    )
}

export default page
