import Search from '@/src/components/form/Search'
import Select from '@/src/components/form/Select'
import PageTitle from '@/src/components/ui/PageTitle'
import UserCard from '@/src/components/ui/UserCard'
import { UsersDTO } from '@/src/types/usersDTO'
import React from 'react'

type Props = {
  users: UsersDTO[];
}

const Users = ({users}:Props) => {
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
          />
          <div className='flex gap-2 mt-2'>
            <Select 
              selectSetup={'USERS_ROLE'}
              label='Usuário'
              colorScheme='primary'
            />
            <Select 
              selectSetup={'USERS_FILTER'}
              label='Filtro'
              colorScheme='primary'
            />
          </div>
        </div>
        <div className='dark:bg-secondary/30 bg-secondary/10 border sm:px-2 mt-4 py-1 rounded-2xl border-secondary'>
          <div className='max-h-110 overflow-auto
            hover:scrollbar-thumb-secondary-light
            scrollbar-thumb-secondary-middledark 
            scrollbar-track-secondary-light/0
              hover:scrollbar-track-transparent
              scrollbar-active-track-transparent
              scrollbar-active-thumb-secondary-light
              scrollbar-thin
          '>
            {users.map((user, index, array) => (
              <React.Fragment key={index}>

                <UserCard
                  user={user}
                />

                {(index < array.length - 1) && 
                  <div className='border mx-2 my-1 border-secondary dark:border-secondary-dark'/>
                }
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Users