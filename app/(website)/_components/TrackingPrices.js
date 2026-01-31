
import { Minus, Plus, ShoppingCart, Trash2 } from "@deemlol/next-icons";

function TrackingPrices() {
    return (
         <div className="w-[90%] h-fit text-white text-[8px] mx-2 mt-2
">
              <div className="border-b border-gray-300 flex
              h-[30px] flex-row justify-between">
                <h2 className="text-md font-bold">Fruir, veg & Salad</h2>
              
                <h2 >
                  
                  1 of 3 left
                </h2>
                <h2 className="text-md font-bold">
                 <span className="text-white">125.97</span>
                </h2>
              </div>
              
 <div className="space-y-2">
             
               
                    <div className="border-b border-gray-300 pb-1">
                      <div className="flex justify-between font-semibold mb-2">
                        <span>1 × Mango</span>
                       
                        <span>1s</span>
                      </div>
                      <form className="flex items-center gap-2 justify-between">
                                             <label className="relative flex items-center cursor-pointer">
    <input
      type="checkbox"
      
      readOnly
      className="peer hidden"
    />

    <span
      className="
        w-6 h-6
        rounded-full
        border-2 border-amber-700
        flex items-center justify-center
      
        transition
      "
    >
      {/* Check mark */}
      
  
     
    </span>
  </label>
                        <div className="flex flex-row w-[40%] justify-between">
                          <div>
                       
                             
                       
                            <Trash2 width={10}  />
                             
                          </div>
                          <span className="font-bold text-sm">1</span>
                          <Plus width={10}  />
                        </div>

                       

                
                          
                      
                      </form>
                    </div>
                  
              </div>
              <div className="space-y-2">
             
               
                    <div className="border-b border-gray-300 pb-1">
                      <div className="flex justify-between font-semibold mb-2">
                        <span className="text-white">2 × Spinach</span>
                       
                        <span>400g</span>
                      </div>
                      <form className="flex items-center gap-2 justify-between">
                                              <label className="relative flex items-center cursor-pointer">
    <input
      type="checkbox"
     
      readOnly
      className="peer hidden"
    />

    <span
      className="
        w-6 h-6
        rounded-full
        border-2 border-amber-700
        flex items-center justify-center
        bg-amber-700
        transition
      "
    >
      {/* Check mark */}
      
        <svg
          className="w-4 h-4 text-white"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
     
    </span>
  </label>
                        <div className="flex flex-row w-[70%] justify-between">
                            <div>
                          <p className=" font-bold text-gray-400">R42.99</p>
                          <p className=" font-bold 
                          text-amber-700">Total: R85.98</p>
                        </div>

                          
                          <div>
                       
                            <Minus width={10}  />
                             
                          </div>
                          <span className="font-bold text-sm">2</span>
                          <Plus width={10}  />
                        </div>

                      
                       
                       
                        
                      </form>
                    </div>
                  
              </div>

               <div className="space-y-2">
             
               
                    <div className="border-b border-gray-300 pb-1">
                   
                         <div className="flex justify-between font-semibold mb-2">
                        <span>1 × Apples</span>
                       
                        <span>1.5kg</span>
                      </div>
                      
                      <form className="
                      hidden lg:flex items-center gap-2 justify-between">
                                              <label className="relative flex items-center cursor-pointer">
    <input
      type="checkbox"
     
      readOnly
      className="peer hidden"
    />

    <span
      className="
        w-6 h-6
        rounded-full
        border-2 border-amber-700
        flex items-center justify-center
        bg-amber-700
        transition
      "
    >
      {/* Check mark */}
      
        <svg
          className="w-4 h-4 text-white"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
     
    </span>
  </label>
                        <div className="flex flex-row w-[70%] justify-between">
                            <div>
                          <p className=" font-bold text-gray-400">R39.99</p>
                          <p className=" font-bold 
                          text-amber-700">Total: R39.99</p>
                        </div>

                          
                          <div>
                       
                            <Minus width={10}  />
                             
                          </div>
                          <span className="font-bold text-sm">1</span>
                          <Plus width={10}  />
                        </div>

                      
                       
                       
                        
                      </form>
                    </div>
                  
              </div>
              
            </div>
          );
       
      
}

export default TrackingPrices
