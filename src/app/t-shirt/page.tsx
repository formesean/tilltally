"use client";
import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Input } from "../../components/ui/input";
import { MoreHorizontal, ArrowLeftToLine } from "lucide-react";
import tshirts from "../../data/tshirts.json";
import codes from "../../data/codesList.json";
import { useRouter } from "next/navigation";

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

interface CheckoutData {
  dateTime: string;
  cashierName: string;
  items: CartItem[];
  code: string;
  total: number;
}

export default function Home() {
  const router = useRouter();
  const [openItem, setOpenItem] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
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

  const toggleDialog = (product: Product) => {
    setSelectedProduct(product);
    setOpenItem(!openItem);
  };

  const addToCart = (size: string) => {
    if (selectedProduct) {
      const item: CartItem = { product: selectedProduct, size };
      setCart([...cart, item]);
      setOpenItem(false);
    }
  };

  const removeItem = (index: number) => {
    const updatedCart = [...cart];
    updatedCart.splice(index, 1);
    setCart(updatedCart);
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

  const updateDateTime = () => {
    setCurrentDateTime(new Date().toLocaleString());
  };

  const handleDiscountCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDiscountCode(e.target.value);
  };

  const handleBack = () => {
    router.push("/");
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleCheckoutConfirm = () => {
    const total = parseFloat(getDiscountedPrice().replace(",", ""));
    const checkoutInfo: CheckoutData = {
      dateTime: currentDateTime,
      cashierName: cashierName,
      items: cart,
      code: discountCode,
      total: total,
    };

    const existingCheckoutData = JSON.parse(
      localStorage.getItem("checkoutData") || "[]"
    );
    const updatedCheckoutData = [...existingCheckoutData, checkoutInfo];
    localStorage.setItem("checkoutData", JSON.stringify(updatedCheckoutData));
    setCart([]);
  };

  return (
    <section className="h-screen flex flex-col items-start justify-center pt-24 p-10">
      <Button onClick={handleBack} className="mb-5 px-3">
        <ArrowLeftToLine className="h-4 w-4" />
      </Button>
      <div className="z-10 w-full h-full justify-between gap-5 font-mono text-sm lg:flex">
        {/* T-Shirts Lists View */}
        <div className="grid grid-cols-3 auto-rows-auto gap-5 w-full max-h-full overflow-y-scroll pr-5">
          {tshirts.map((product, index) => (
            <Card
              className="hover:cursor-pointer"
              onClick={() => toggleDialog(product)}
              key={index}
            >
              <CardHeader>
                <CardTitle>{product.brand}</CardTitle>
                <CardDescription>{product.product_name}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Cart View */}
        <Card className="w-full flex flex-col justify-between">
          <CardHeader>
            <CardTitle>Cart</CardTitle>
            <CardDescription>Your items:</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col justify-between items-stretch">
            <div className="h-[400px] overflow-y-scroll">
              {cart.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-start border-b border-gray-200 py-2"
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
            </div>
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <div className="flex justify-between items-center">
              <span>Total: ₱{getTotalPrice()}</span>
            </div>

            <div className="flex gap-2">
              <Button variant="ghost" onClick={handleClearCart}>
                Clear Cart
              </Button>

              {/* Checkout Dialog View */}
              <Dialog>
                <DialogTrigger asChild onClick={updateDateTime}>
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
                    <div className="h-[300px] overflow-y-scroll mt-10">
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
                      <DialogClose onClick={handleCheckoutConfirm}>
                        <Button>Confirm</Button>
                      </DialogClose>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardFooter>
        </Card>

        {/* Item Dialog View */}
        <Dialog open={openItem} onOpenChange={() => setOpenItem(!openItem)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedProduct?.brand}</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <div>Product Name: {selectedProduct?.product_name}</div>
              <div>
                Price: ₱
                {selectedProduct?.price.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </div>
              <div>Color: {selectedProduct?.color}</div>
              <div>
                Sizes:{" "}
                {selectedProduct?.size.map((size, index) => (
                  <Button
                    key={index}
                    className="mr-2 mb-2"
                    onClick={() => addToCart(size)}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
