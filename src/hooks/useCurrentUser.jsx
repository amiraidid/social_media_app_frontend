import React, { useEffect, useState } from 'react'
import { getCurrentUser } from '../utils/current_user';

export default function useCurrentUser() {
  const [currentUser, setCurrentUser] = useState({});
  useEffect(() => {
    const fetchCurrentUser = async () => {
        const current_user = await getCurrentUser();
        setCurrentUser(current_user)
    }
    fetchCurrentUser();
  }, [])

  return { currentUser }
}
