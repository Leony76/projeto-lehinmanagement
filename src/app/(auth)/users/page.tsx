import { getUsers } from '@/src/services/users';
import Users from './Users';

const UsersPage = async() => {

  const { admins, customers, sellers } = await getUsers();

  const users = [
    ...customers, 
    ...sellers, 
    ...admins
  ];

  return (
    <Users
      users={users}
    />
  )
}

export default UsersPage;