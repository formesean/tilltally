import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import productsList from "../data/productsList.json";

export default function Home() {
  return (
    <main className="h-screen flex flex-col items-center justify-center pt-24 p-10">
      <div className="z-10 w-full h-full justify-between gap-5 font-mono text-sm lg:flex">
        {/* Products Lists View */}
        <div className="grid grid-cols-3 auto-rows-auto gap-5 w-full max-h-full overflow-y-scroll pr-5">
          {productsList.map((product, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{product.title}</CardTitle>
                <CardDescription>{product.desc}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Cart View */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Cart</CardTitle>
            <CardDescription>Your items will appear here</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Card Content</p>
          </CardContent>
          <CardFooter>
            <Button>Checkout</Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
