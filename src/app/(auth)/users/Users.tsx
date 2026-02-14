'use client';

import Search from '@/src/components/form/Search'
import Select from '@/src/components/form/Select'
import NoContentFoundMessage from '@/src/components/ui/NoContentFoundMessage';
import PageTitle from '@/src/components/ui/PageTitle'
import UserCard from '@/src/components/ui/UserCard'
import { UserRoleFilterValue, UsersFilterValue } from '@/src/constants/generalConfigs'
import { secondaryColorScrollBar } from '@/src/styles/scrollBar.style';
import { UsersDTO } from '@/src/types/usersDTO'
import { filteredUsersList } from '@/src/utils/filters/filteredUserList';
import React, { useMemo, useState } from 'react'

type Props = {
  users: UsersDTO[];
}

const Users = ({
  users
}:Props) => {

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<UserRoleFilterValue | ''>('');
  const [orderFilter, setOrderFilter] = useState<UsersFilterValue | ''>('');

  const { filteredUsers } = filteredUsersList(
    users,
    searchTerm,
    roleFilter,
    orderFilter,
  );

  return (
    <div>
      <PageTitle 
        title='Usuários'
        style='my-4'
      />
      <div>
        <div>
          <Search 
            colorScheme={'primary'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className='flex gap-2 mt-2'>
            <Select 
              selectSetup={'USERS_ROLE'}
              label='Usuário'
              colorScheme='primary'
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as UserRoleFilterValue)}
            />
            <Select 
              selectSetup={'USERS_FILTER'}
              label='Filtro'
              colorScheme='primary'
              value={orderFilter}
              onChange={(e) => setOrderFilter(e.target.value as UsersFilterValue)}
            />
          </div>
        </div>
        <div className='dark:bg-secondary/30 bg-secondary/10 border sm:px-2 mt-4 py-1 rounded-2xl border-secondary'>
          <div className={`max-h-110 overflow-auto ${secondaryColorScrollBar}`}>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <UserCard 
                  key={user.id || index}
                  user={user}
                  isDivided={index < filteredUsers.length - 1} 
                />
              ))
            ) : (
              <NoContentFoundMessage 
                text={'Nenhum usuário encontrado'}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Users