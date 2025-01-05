import {
  Enabled,
  QueryFunction,
  QueryKey,
  useQuery,
} from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useQueryData } from "./useQueryData";
import { searchUsers } from "@/actions/user";

export const useSearch = (key: string, type: "USERS") => {
  const [debounce, setDebounce] = useState(false);
  const [query, setQuery] = useState("");
  const [onUser, setOnUser] = useState<
    | {
        id: string;
        subscription: {
          plan: "FREE" | "PRO";
        } | null;
        firstName: string | null;
        lastName: string | null;
        image: string | null;
        email: string | null;
      }[]
    | null
  >(null);
  const onSearchQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchQuery = e.target.value;
    setQuery(searchQuery);
  };

  useEffect(() => {
    const delayInputTimeoutId = setTimeout(() => {
      setDebounce(true);
    }, 1000);
    return () => {
      clearTimeout(delayInputTimeoutId);
    };
  }, [query]);
  const { refetch, isFetching } = useQueryData(
    [key, debounce],
    async ({ queryKey }) => {
      if (type === "USERS") {
        const users = await searchUsers(queryKey[1] as string);
        if (users.status === 200) {
          setOnUser(users.data);
        }
      }
    },
    false
  );
  useEffect(() => {
    if (debounce) {
      refetch();
    }else{
        setDebounce(false)
    }
    return () => {
        debounce
    }
  }, [debounce]);

  return {
    onSearchQuery,
    query,
    isFetching,
    onUser
  };
};
