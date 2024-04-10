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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import { Separator } from "../components/ui/separator";
import { Input } from "../components/ui/input";
import { Checkbox } from "../components/ui/checkbox";
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
  const [showToSDialog, setShowToSDialog] = useState(false);
  const [agreedToToS, setAgreedToToS] = useState(false);
  const [eulaChecked, setEulaChecked] = useState(false);
  const [tosChecked, setTosChecked] = useState(false);

  useEffect(() => {
    const hasAgreedToToS = sessionStorage.getItem("agreedToToS");
    if (!hasAgreedToToS) {
      setShowToSDialog(true);
    }
  }, []);

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

  const handleAgreeToToS = () => {
    if (eulaChecked && tosChecked) {
      setAgreedToToS(true);
      sessionStorage.setItem("agreedToToS", "true");
      setShowToSDialog(false);
    }
  };

  const handleClearCart = () => {
    setCart([]);
  };

  return (
    <main className="h-screen flex flex-col items-center justify-center pt-24 p-10">
      <div className="z-10 w-full max-h-screen justify-between gap-5 font-mono text-sm flex">
        {/* EULA & ToS Dialog */}
        <AlertDialog open={showToSDialog}>
          <AlertDialogContent className="max-w-4xl max-h-[600px]">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl">
                End-User Licensing Agreement (EULA) & Terms of Service (ToS)
              </AlertDialogTitle>
              <Separator />
              <AlertDialogDescription className="text-base max-h-[500px] overflow-y-scroll pr-5">
                <div className="py-3">
                  <p className="text-justify dark:text-slate-300">
                    Welcome to the Point-of-Sale (POS) System provided by
                    TeleGestoni Inc.! Before you proceed to use our system, we
                    kindly ask you to review and accept our End-User Licensing
                    Agreement (EULA) and Terms of Service (ToS). These
                    agreements outline the terms and conditions that govern your
                    use of our software and services. By accepting the EULA and
                    ToS, you agree to comply with the rules and guidelines set
                    forth by TeleGestoni Inc. regarding the use of our POS
                    system. These agreements are designed to ensure a fair,
                    secure, and enjoyable experience for all users. Please take
                    a moment to review the EULA and ToS carefully. If you have
                    any questions or concerns, feel free to reach out to our
                    support team for assistance. Thank you for choosing
                    TeleGestoni Inc. for your point-of-sale needs!
                  </p>
                </div>

                <Separator />

                {/* EULA */}
                <div className="py-3">
                  <h1 className="text-lg font-semibold text-secondary-foreground">
                    End-User Licensing Agreement (EULA)
                  </h1>
                  <p className="pt-3 dark:text-slate-300">
                    Important: Please read this End-User-License-Agreement
                    (“EULA”) carefully before installing and or using the
                    Point-of-Sale (POS) System. By installing or using the
                    software, you agree to be bound by the terms and conditions
                    of this agreement. If you do not agree to the terms and
                    conditions of this agreement, do not install or use the
                    system.
                    <ol className="pt-3 flex flex-col gap-2">
                      <li>
                        1. LICENSE GRANT:{" "}
                        <span className="block pl-5">
                          Subject to the terms and conditions of this Agreement,
                          [TELEGESTONI Inc] ("Licensor") grants you a
                          non-exclusive, non-transferable, revocable license to
                          use the Point-of-Sale (POS) System software
                          ("Software") solely for your internal business
                          purposes. This license does not include any right to
                          sublicense, distribute, or otherwise transfer the
                          Software to any third party.
                        </span>
                      </li>
                      <li>
                        2. RESTRICTIONS:
                        <ol className="pl-5">
                          <li>You shall not:</li>
                          <li className="pl-5">
                            a. Modify, adapt, translate, reverse engineer,
                            decompile, disassemble or otherwise attempt to
                            derive the source code of the Software;
                          </li>
                          <li className="pl-5">
                            b. Use the Software in any manner that violates
                            applicable laws or regulations;
                          </li>
                          <li className="pl-5">
                            c. Remove or alter any copyright, trademark, or
                            other proprietary notices contained in the Software;
                          </li>
                          <li className="pl-5">
                            d. Rent, lease, lend, sell, redistribute, or
                            sublicense the Software;
                          </li>
                          <li className="pl-5">
                            e. Use the Software to develop any competing
                            software product.
                          </li>
                        </ol>
                      </li>
                      <li>
                        3. OWNERSHIP:{" "}
                        <span className="block pl-5">
                          Licensor retains all right, title, and interest in and
                          to the Software, including all intellectual property
                          rights therein. This Agreement does not convey to you
                          any rights of ownership in or related to the Software.
                        </span>
                      </li>
                      <li>
                        4. SUPPORT AND MAINTENANCE:{" "}
                        <span className="block pl-5">
                          Licensor may provide support and maintenance services
                          for the Software, at its sole discretion. Any such
                          support and maintenance shall be subject to the terms
                          of this Agreement and may be subject to additional
                          fees.
                        </span>
                      </li>
                      <li>
                        5. TERMINATION:{" "}
                        <span className="block pl-5">
                          This Agreement shall terminate automatically if you
                          fail to comply with any of its terms and conditions.
                          Upon termination, you shall cease all use of the
                          Software and destroy all copies of the Software in
                          your possession or control.
                        </span>
                      </li>
                      <li>
                        6. ENTIRE AGREEMENT:{" "}
                        <span className="block pl-5">
                          This Agreement constitutes the entire agreement
                          between the parties concerning the subject matter
                          hereof and supersedes all prior or contemporaneous
                          agreements or understandings, written or oral,
                          concerning such subject matter. By installing or using
                          the Software, you acknowledge that you have read this
                          Agreement, understand it, and agree to be bound by its
                          terms and conditions. If you have any questions
                          regarding this Agreement, please contact the
                          TELEGESTONI Inc Support Staff.
                        </span>
                      </li>
                    </ol>
                  </p>
                </div>

                <Separator />

                {/* ToS */}
                <div className="py-3">
                  <h1 className="text-lg font-semibold text-secondary-foreground">
                    Terms of Service (ToS)
                  </h1>
                  <p className="pt-3 dark:text-slate-300">
                    <ol className="pt-3 flex flex-col gap-2">
                      <li>
                        1. Acceptance of Terms:
                        <span className="block pl-5">
                          By accessing or using the POS system provided by
                          TeleGestoni Inc., you agree to abide by these Terms of
                          Service. If you do not agree with any part of these
                          terms, you may not use the system.
                        </span>
                      </li>
                      <li>
                        2. User Accounts and Access:
                        <ol className="pl-5">
                          <li>
                            a. Users must create an account to access certain
                            features of the POS system.
                          </li>
                          <li>
                            b. User accounts are for individual use only and
                            should not be shared with others.
                          </li>
                          <li>
                            c. Users are responsible for maintaining the
                            security of their account credentials.
                          </li>
                        </ol>
                      </li>
                      <li>
                        3. Data Security and Privacy:
                        <ol className="pl-5">
                          <li>
                            a. TeleGestoni Inc. is committed to protecting user
                            data and complies with relevant data protection
                            laws.
                          </li>
                          <li>
                            b. User data collected through the POS system will
                            be used for transaction processing and internal
                            analytics only.
                          </li>
                          <li>
                            c. Payment information is encrypted and securely
                            processed in compliance with industry standards.
                          </li>
                        </ol>
                      </li>
                      <li>
                        4. Usage Guidelines:
                        <ol className="pl-5">
                          <li>
                            a. Users must use the POS system only for lawful
                            purposes and in compliance with applicable laws and
                            regulations.
                          </li>
                          <li>
                            b. Unauthorized access, tampering with system
                            settings, or misuse of the system is strictly
                            prohibited.
                          </li>
                          <li>
                            c. The POS system is intended for processing apparel
                            sales transactions and related activities.
                          </li>
                        </ol>
                      </li>
                      <li>
                        5. Intellectual Property
                        <ol className="pl-5">
                          <li>
                            a. The POS system and all related software,
                            trademarks, and content are the property of
                            TeleGestoni Inc..
                          </li>
                          <li>
                            b. Users may not copy, modify, distribute, or
                            reverse engineer the system without explicit
                            permission.
                          </li>
                        </ol>
                      </li>
                      <li>
                        6. Limitation of Liability:
                        <ol className="pl-5">
                          <li>
                            a. TeleGestoni Inc. is not liable for any damages
                            arising from system downtime, data breaches, or
                            technical issues.
                          </li>
                          <li>
                            b. Users are responsible for their use of the system
                            and any consequences thereof.
                          </li>
                        </ol>
                      </li>
                      <li>
                        7. Termination:
                        <ol className="pl-5">
                          <li>
                            a. TeleGestoni Inc. reserves the right to suspend or
                            terminate user accounts for violations of these
                            terms or for other reasons deemed necessary.
                          </li>
                          <li>
                            b. Upon termination, users may lose access to their
                            data stored within the POS system.
                          </li>
                        </ol>
                      </li>
                      <li>
                        8. Updates and Modifications:
                        <ol className="pl-5">
                          <li>
                            a. These terms may be updated or modified by
                            TeleGestoni Inc. from time to time without prior
                            notice.
                          </li>
                          <li>
                            b. Users will be notified of significant changes to
                            the terms, and continued use of the system
                            constitutes acceptance of the updated terms.
                          </li>
                        </ol>
                      </li>
                      <li>
                        9. Governing Law:
                        <ol className="pl-5">
                          <li>
                            a. These terms shall be governed by and construed in
                            accordance with the laws of the Philippines.
                          </li>
                          <li>
                            b. Any disputes arising from these terms shall be
                            resolved through arbitration in the Philippines.
                          </li>
                        </ol>
                      </li>
                      <li>
                        10. Contact Information:
                        <span className="block pl-5">
                          For questions or inquiries regarding these Terms of
                          Service, please contact TeleGestoni Inc. at [Contact
                          Email or Phone Number].
                        </span>
                      </li>
                    </ol>
                  </p>
                </div>

                <Separator />

                <div className="flex justify-center items-center gap-3 py-10">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="eula"
                      checked={eulaChecked}
                      onCheckedChange={() => setEulaChecked(!eulaChecked)}
                    />
                    <label
                      htmlFor="eula"
                      className="text-sm text-slate-900 dark:text-secondary-foreground font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Accept End-User Licensing Agreement
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="tos"
                      checked={tosChecked}
                      onCheckedChange={() => setTosChecked(!tosChecked)}
                    />
                    <label
                      htmlFor="tos"
                      className="text-sm text-slate-900 dark:text-secondary-foreground font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Accept Terms of Service
                    </label>
                  </div>
                </div>

                <div className="flex justify-end py-3">
                  <AlertDialogAction
                    onClick={handleAgreeToToS}
                    disabled={!(tosChecked && eulaChecked)}
                  >
                    Accept
                  </AlertDialogAction>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
          </AlertDialogContent>
        </AlertDialog>

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
        <Card className="w-full flex flex-col justify-between">
          <CardHeader>
            <CardTitle>Cart</CardTitle>
            <CardDescription>Your items:</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col justify-between items-stretch">
            <div className="h-[470px] overflow-y-scroll">
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
            </div>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
