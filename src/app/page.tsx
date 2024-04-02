"use client";
import { useRouter } from "next/navigation";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import productsList from "../data/productsList.json";
import codes from "../data/codesList.json";
import { useEffect, useState } from "react";
import { MoreHorizontal } from "lucide-react";

interface Product {
  brand: string;
  product_name: string;
  price: number;
  color: string;
  size: string[];
}

interface CartItem {
  product: Product;
  size: string;
}

export default function Home() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== "undefined") {
      const storedCart = localStorage.getItem("cart");
      return storedCart ? JSON.parse(storedCart) : [];
    } else {
      return [];
    }
  });
  const [cashierName, setCashierName] = useState("");
  const [currentDateTime, setCurrentDateTime] = useState(
    new Date().toLocaleString()
  );
  const [discountCode, setDiscountCode] = useState("");

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const handleProductClick = (route: string) => {
    router.replace(route);
  };

  const removeItem = (index: number) => {
    const updatedCart = [...cart];
    updatedCart.splice(index, 1);
    setCart(updatedCart);
  };

  const updateDateTime = () => {
    setCurrentDateTime(new Date().toLocaleString());
  };

  const applyDiscount = (code: string): number => {
    const discount = codes.find((discount) => discount.code === code);
    return discount ? discount.discount : 0;
  };

  const getTotalPrice = () => {
    return cart
      .map((item) => item.product.price)
      .reduce((total, price) => total + price, 0)
      .toLocaleString(undefined, {
        minimumFractionDigits: 2,
      });
  };

  const getDiscountedPrice = (): string => {
    const totalWithoutDiscount: number = cart
      .map((item) => item.product.price)
      .reduce((total, price) => total + price, 0);

    const discountPercentage: number = applyDiscount(discountCode);
    const discountAmount: number =
      totalWithoutDiscount * (discountPercentage / 100);
    const totalPrice: number = totalWithoutDiscount - discountAmount;
    const formattedTotalPrice: string = totalPrice.toFixed(2);
    const localizedTotalPrice: string = formattedTotalPrice.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      ","
    );

    return localizedTotalPrice;
  };

  const handleDiscountCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDiscountCode(e.target.value);
  };

  return (
    <main className="h-screen flex flex-col items-center justify-center pt-24 p-10">
      <div className="z-10 w-full h-full justify-between gap-5 font-mono text-sm flex">
        {/* Products Lists View */}
        <div className="grid grid-cols-3 auto-rows-auto gap-5 w-full max-h-full overflow-y-scroll pr-5">
          {productsList.map((product, index) => (
            <div key={index} className="relative">
              {product.tba ? (
                <div className="select-none">
                  <span className="absolute top-0 left-0 bg-red-500 text-white py-1 px-2 z-10">
                    Coming Soon
                  </span>
                  <Card className="w-[203.3px] h-[108px]">
                    <CardHeader>
                      <CardTitle>{product.title}</CardTitle>
                      <CardDescription>{product.desc}</CardDescription>
                    </CardHeader>
                  </Card>
                </div>
              ) : (
                <Card
                  className="w-[203.3px] h-[108px] hover:cursor-pointer"
                  onClick={() => handleProductClick(product.route)}
                >
                  <CardHeader>
                    <CardTitle>{product.title}</CardTitle>
                    <CardDescription>{product.desc}</CardDescription>
                  </CardHeader>
                </Card>
              )}
            </div>
          ))}
        </div>

        {/* Cart View */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Cart</CardTitle>
            <CardDescription>Your items:</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] overflow-y-scroll">
            {cart.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center border-b border-gray-200 py-2"
              >
                <div className="flex items-center">
                  <div>
                    <p className="font-semibold">{item.product.product_name}</p>
                    <p className="text-sm text-gray-500">
                      {item.product.brand} - Size: {item.size}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <p className="text-sm text-gray-500">
                    ₱
                    {item.product.price.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => removeItem(index)}>
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </CardContent>

          <CardFooter className="flex justify-between items-center">
            <div className="flex justify-between items-center">
              <span>Total: ₱{getTotalPrice()}</span>
            </div>

            {/* Checkout Dialog View */}
            <Dialog>
              <DialogTrigger onClick={updateDateTime}>
                <Button>Checkout</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Checkout</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-3">
                  <div className="flex gap-3">
                    <p className="text-sm text-muted-foreground">
                      Date & Time:
                    </p>
                    <p>{currentDateTime}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-sm text-muted-foreground">Cashier:</p>
                    <Input
                      type="text"
                      placeholder="Cashier Name"
                      value={cashierName}
                      onChange={(e) => setCashierName(e.target.value)}
                      className="h-6"
                    />
                  </div>
                  {/* add a discount/promotion feature here which will be ine a percentage and should be applied to the total below  */}
                  <div className="flex items-center gap-3">
                    <p className="text-sm text-muted-foreground">
                      Discount/Promotion:
                    </p>
                    <Input
                      type="text"
                      placeholder="CODE"
                      className="h-6"
                      value={discountCode}
                      onChange={handleDiscountCodeChange}
                    />
                  </div>
                  <div className="pt-10">
                    {cart.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center border-b border-gray-200 py-2"
                      >
                        <div className="flex items-center">
                          <div>
                            <p className="font-semibold">
                              {item.product.product_name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {item.product.brand} - Size: {item.size}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <p className="text-sm text-gray-500">
                            ₱
                            {item.product.price.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center pt-10">
                    <span>Total: ₱{getDiscountedPrice()}</span>
                    <DialogClose>
                      <Button>Confirm</Button>
                    </DialogClose>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
