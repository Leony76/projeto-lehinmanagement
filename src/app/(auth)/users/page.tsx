import { getUsers } from '@/src/services/users';
import Users from './Users';

const UsersPage = async() => {

  const users = await getUsers();

  return (
    <Users
      users={users}
    />
  )
}

export default UsersPage;