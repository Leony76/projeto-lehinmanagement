import { getUsers } from '@/src/actions/userActions';
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