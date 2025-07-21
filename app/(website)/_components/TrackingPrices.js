
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
                        <div className="flex flex-row w-[30%] justify-between">
                          <div>
                       
                             
                       
                            <Trash2 width={10}  />
                             
                          </div>
                          <span className="font-bold text-sm">1</span>
                          <Plus width={10}  />
                        </div>

                       

                
                          <ShoppingCart className='text-[#A2B06D]' />
                      
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
                        <div className="flex flex-row w-[30%] justify-between">
                          <div>
                       
                            <Minus width={10}  />
                             
                          </div>
                          <span className="font-bold text-sm">2</span>
                          <Plus width={10}  />
                        </div>

                        <div>
                          <p className=" font-bold text-gray-400">R42.99</p>
                          <p className=" font-bold text-white">Total: R85.98</p>
                        </div>

                       
                          <ShoppingCart className='text-gray-500 text-[15px]'/>
                        
                      </form>
                    </div>
                  
              </div>
              <div className="space-y-2">
             
               
                    <div className=" pb-1 md:border-b border-gray-300">
                      <div className="flex justify-between font-semibold mb-2">
                        <span>1 × Apples</span>
                       
                        <span>1.5kg</span>
                      </div>
                     <form className=" items-center gap-2 justify-between
                     hidden sm:flex">
                        <div className="flex flex-row w-[30%] justify-between">
                          <div>
                       
                            <Trash2 width={10}  />
                             
                          </div>
                          <span className="font-bold text-sm">1</span>
                          <Plus width={10}  />
                        </div>

                        <div>
                          <p className=" font-bold text-gray-400">R39.99</p>
                          <p className=" font-bold text-white">Total: R39.99</p>
                        </div>

                       
                          <ShoppingCart className='text-gray-500 text-[15px]'/>
                        
                      </form>
                    </div>
                  
              </div>
            </div>
          );
       
      
}

export default TrackingPrices
