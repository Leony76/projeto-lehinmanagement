import { UserRoleFilterValue, UsersFilterValue } from "@/src/constants/generalConfigs";
import { UsersDTO } from "@/src/types/usersDTO";
import { useMemo } from "react";

export const filteredUsersList = (
  users: UsersDTO[],
  searchTerm: string,
  roleFilter: UserRoleFilterValue | '',
  orderFilter: UsersFilterValue | '',
) => {
  const filteredUsers = useMemo(() => {
    return users
      .filter((user) => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase())
        
        const matchesRole = !roleFilter || user.role === roleFilter
  
        const matchesStatus = 
          orderFilter === 'actived_account' 
            ? user.isActive 
          : orderFilter === 'deactived_account' 
            ? !user.isActive 
          : true;
  
        return matchesSearch && matchesRole && matchesStatus
      })
      .sort((a, b) => {
        switch (orderFilter) {
          case 'more_sold':
            return (b.role === 'SELLER' ? b.stats.salesDone : 0) - (a.role === 'SELLER' ? a.stats.salesDone : 0)
          default:
            return 0
        }
      })
  }, [users, searchTerm, roleFilter, orderFilter]);

  return { filteredUsers }
}