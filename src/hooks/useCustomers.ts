import { useState, useEffect } from "react";

interface Customer {
    username: string;
    name: string;
    email: string;
    gender: string;
    registered: string;
}

interface APIUser {
    login: { username: string };
    name: { first: string; last: string };
    email: string;
    gender: string;
    registered: { date: string };
}

const useCustomers = (search: string, selectedGender: string) => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await fetch('https://randomuser.me/api/?results=10');
                const data = await response.json();

                const formattedCustomers = data.results.map((user: APIUser) => ({
                    username: user.login.username,
                    name: `${user.name.first} ${user.name.last}`,
                    email: user.email,
                    gender: user.gender,
                    registered: new Date(user.registered.date).toLocaleString()
                }));

                setCustomers(formattedCustomers);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching customers:', error);
                setLoading(false);
            }
        };

        fetchCustomers();
    }, [search, selectedGender]);

    return { customers, loading };
};

export default useCustomers;