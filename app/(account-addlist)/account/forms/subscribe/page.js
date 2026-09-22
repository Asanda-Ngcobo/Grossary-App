
import SubscribeButton from "./SubscribeButton";



export default function SubscribePage() {

  return (

    <main
      className="
        min-h-screen
        bg-[#F7FAF8]
        px-4
        py-12
      "
    >

      <div
        className="
          max-w-lg
          mx-auto
        "
      >

        <div
          className="
            text-center
          "
        >

          <div
            className="
              inline-flex
              bg-[#0B2E1E]
              text-white
              font-bold
              rounded-2xl
              px-4
              py-2
            "
          >
            grossary<span className="text-[#1EC677]">plus</span>
          </div>


          <h1
            className="
              text-3xl
              font-bold
              text-[#0B2E1E]
              mt-5
            "
          >
            Save up to <span className="text-[#1EC677]">R100</span>{" "} per 6 Items
          </h1>


          <p
            className="
              text-gray-500
              mt-3
            "
          >
            grossary plus compares your
            grocery list across participating nearby
            stores and shows you where
            each item is cheaper.
          </p>

        </div>


        <div
          className="
            bg-white
            border
            border-gray-100
            rounded-3xl
            p-6
            mt-8
          "
        >

          <div
            className="
              flex
              items-end
              gap-1
            "
          >

            <span
              className="
                text-4xl
                font-bold
                text-[#0B2E1E]
              "
            >
              R39
            </span>

            <span
              className="
                text-gray-500
                mb-1
              "
            >
              /month
            </span>

          </div>


          <p
            className="
              text-[#1EC677]
              font-semibold
              mt-2
            "
          >
            First 7 days free
          </p>


          <div
            className="
              border-t
              border-gray-100
              my-6
            "
          />


          <div
            className="
              space-y-4
              text-sm
              text-[#0B2E1E]
            "
          >

            <p>
              ✓ Compare your list across
              nearby stores
            </p>

            <p>
              ✓ Find the cheapest store
              for each item
            </p>

            <p>
              ✓ Get your best-value
              shopping plan
            </p>

            <p>
              ✓ Compare it with the
              convenience of one store
            </p>

            <p>
              ✓ See retailer promotional
              savings
            </p>

          </div>


       <SubscribeButton/>

        </div>

      </div>

    </main>
  );
}