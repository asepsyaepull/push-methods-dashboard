"use client";

import { useState, useEffect } from "react";
import { Pencil, Search, Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pagination } from "@/components/ui/pagination";
import useSWR from 'swr';
import Sidebar from "@/components/sidebar/Sidebar";

const fetcher = (url: string) => fetch(url).then(res => res.json());

interface Customer {
  login: {
    uuid: string;
    username: string;
  };
  name: {
    first: string;
    last: string;
  };
  email: string;
  gender: string;
  registered: {
    date: string;
  };
}

export default function Home() {
  const [search, setSearch] = useState("");
  const [selectedGender, setSelectedGender] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: string } | null>(null);

  const { data, error } = useSWR(`https://randomuser.me/api/?page=${currentPage}&results=${itemsPerPage}&seed=abc`, fetcher);

  const customers = data?.results || [];
  const loading = !data && !error;

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedGender]);

  const filteredCustomers = customers.filter((customer: Customer) => {
    const matchesSearch =
      customer.name.first.toLowerCase().includes(search.toLowerCase()) ||
      customer.email.toLowerCase().includes(search.toLowerCase()) ||
      customer.login.username.toLowerCase().includes(search.toLowerCase());

    const matchesGender = selectedGender === "all" || customer.gender.toLowerCase() === selectedGender.toLowerCase();

    return matchesSearch && matchesGender;
  });

  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    if (sortConfig !== null) {
      const aValue = a[sortConfig.key as keyof Customer];
      const bValue = b[sortConfig.key as keyof Customer];
      if (aValue < bValue) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
    }
    return 0;
  });

  const handleSort = (key: string) => {
    let direction = "ascending";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const paginatedCustomers = sortedCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allCustomerIds = paginatedCustomers.map((customer: Customer) => customer.login.uuid);
      setSelectedCustomers(allCustomerIds);
    } else {
      setSelectedCustomers([]);
    }
  };

  const handleSelectCustomer = (uuid: string) => {
    setSelectedCustomers((prevSelected) =>
      prevSelected.includes(uuid)
        ? prevSelected.filter((id) => id !== uuid)
        : [...prevSelected, uuid]
    );
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-4 md:p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold mb-1">Customers</h1>
            <p className="text-gray-500">Showing data over the last 30 days</p>
          </div>
            <div className="mb-6 flex flex-col md:flex-row justify-between space-y-4 md:space-y-0">
            <Select
              defaultValue="all"
              onValueChange={setSelectedGender}
            >
              <SelectTrigger className="w-full md:w-48 border-gray-300">
              <SelectValue placeholder="Filter by gender" />
              </SelectTrigger>
              <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative w-full md:w-72">
              <Input
              className="w-full md:h-10 border-gray-300 pl-10"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
            </div>
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead className="flex w-12 h-8 p-8  items-center justify-center">
                    <input
                      type="checkbox"
                      className="rounded-lg"
                      onChange={handleSelectAll}
                      checked={selectedCustomers.length === paginatedCustomers.length}
                    />
                  </TableHead>
                  <TableHead className="font-medium text-black cursor-pointer" onClick={() => handleSort("login.username")}>
                    Username
                  </TableHead>
                  <TableHead className="font-medium text-black cursor-pointer" onClick={() => handleSort("name.first")}>
                    Name
                  </TableHead>
                  <TableHead className="font-medium text-black cursor-pointer" onClick={() => handleSort("email")}>
                    Email
                  </TableHead>
                  <TableHead className="font-medium text-black cursor-pointer" onClick={() => handleSort("gender")}>
                    Gender
                  </TableHead>
                  <TableHead className="font-medium text-black cursor-pointer" onClick={() => handleSort("registered.date")}>
                    Registered on
                  </TableHead>
                  <TableHead className="w-24 font-medium text-black" hideIcon>
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Loading customers...
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-red-500">
                      Failed to load customers
                    </TableCell>
                  </TableRow>
                ) : paginatedCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No customers found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedCustomers.map((customer: Customer) => (
                    <TableRow key={customer.login.uuid}>
                      <TableCell className="flex w-12 h-20 p-8 items-center justify-center">
                        <input
                          type="checkbox"
                          className="rounded"
                          checked={selectedCustomers.includes(customer.login.uuid)}
                          onChange={() => handleSelectCustomer(customer.login.uuid)}
                        />
                      </TableCell>
                      <TableCell>{customer.login.username}</TableCell>
                      <TableCell>{customer.name.first} {customer.name.last}</TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell className="capitalize">{customer.gender}</TableCell>
                      <TableCell>{new Date(customer.registered.date).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                      })}</TableCell>
                      <TableCell className="flex space-x-2">
                        <button className="p-2 hover:bg-gray-100 rounded-full">
                          <Pencil size={16} />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-full text-red-500">
                          <Trash size={16} />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            <div className="p-4 border-t flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <Pagination
                currentPage={currentPage}
                totalItems={filteredCustomers.length}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}