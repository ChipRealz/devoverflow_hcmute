import { SignedIn, UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import Theme from './Theme'
import MobileNav from './MobileNav'
import GlobalSearch from '../search/GlobalSearch'
import { OrgSwitcher } from '../org-switcher'
import { auth } from '@clerk/nextjs/server'

const Navbar = () => {
    const { userId } = auth();
    
    const allowedClerkIds = ["user_2n9yKIQKzFEWiFSNTtGohNtgHd0", "user_2n9yRQAbVm75yaEwAFrd3sGmKVh", "user_2npM4qgGMMBsk8rnbBtb38B6jBk"];
  return (
    <nav className='flex-between background-light900_dark200 
    fixed z-50 w-full gap-5 p-6 shadow-light-300 
    dark:shadow-none sm:px-12 '>
        <Link href='/' className='flex items-center gap-1'>
            <Image
                src="/assets/images/site-logo.svg"
                width={25}
                height={25}
                alt='DevOverFlow'    
            />

            <p
            className='h2-bold font-spaceGrotesk text-dark-100 
            dark:text-light-900 max-sm:hidden'>Dev<span
            className='text-primary-500'>OverFlow</span></p>
        </Link>

        <GlobalSearch/>

        <div className='flex-between gap-5'>
            <Theme/>
            
            <SignedIn>
            {userId && allowedClerkIds.includes(userId) && <OrgSwitcher/>}
            <UserButton afterSwitchSessionUrl="/"
            appearance={{
                elements: {
                    avatarBox:'h-10 w-10'
                },
                variables: {
                    colorPrimary: '#ff7000'
                }
            }}
            />
            </SignedIn>

            <MobileNav/>
        </div>
    </nav>
  )
}

export default Navbar