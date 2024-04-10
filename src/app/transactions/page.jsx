"use client";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Button } from "../../components/ui/button";
import { MoreHorizontal } from "lucide-react";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const storedTransactions = JSON.parse(
      localStorage.getItem("checkoutData") || "[]"
    );
    setTransactions(storedTransactions);
  }, []);

  const handleDelete = (index) => {
    const updatedTransactions = [...transactions];
    updatedTransactions.splice(index, 1);
    setTransactions(updatedTransactions);
    localStorage.setItem("checkoutData", JSON.stringify(updatedTransactions));
  };

  return (
    <>
      <section className="pt-24 p-10">
        <div className="z-10 w-full max-h-screen justify-between gap-5 font-mono text-sm flex">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Time</TableHead>
                <TableHead>Cashier Name</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Promo Code</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction, index) => (
                <TableRow key={index}>
                  <TableCell>{transaction.dateTime}</TableCell>
                  <TableCell>{transaction.cashierName}</TableCell>
                  <TableCell>
                    <ul>
                      {transaction.items.map((item, index) => (
                        <li
                          key={index}
                        >{`${item.product.product_name} - ${item.size}`}</li>
                      ))}
                    </ul>
                  </TableCell>
                  <TableCell>₱{transaction.total.toFixed(2)}</TableCell>
                  <TableCell>{transaction.code}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleDelete(index)}>
                          Delete Transaction
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </>
  );
}
