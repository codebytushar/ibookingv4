"use client";
import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  IdentificationIcon,
  RocketLaunchIcon,
  ClipboardDocumentListIcon,
  CheckBadgeIcon,
  CircleStackIcon,
  ArrowRightStartOnRectangleIcon,
  ArrowLeftStartOnRectangleIcon,
  ChartBarSquareIcon,
  ArrowsPointingInIcon,
  BellAlertIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';



// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const linksStudent = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  {
    name: 'Add Details',
    href: '/dashboard/students/adddetails',
    icon: IdentificationIcon,
  },
  {
    name: 'Add Activity',
    href: '/dashboard/students/addactivity',
    icon: RocketLaunchIcon,
  },
  {
    name: 'My Activities',
    href: '/dashboard/students/myactivities',
    icon: ClipboardDocumentListIcon,
  },
  {
    name: 'My Points',
    href: '/dashboard/students/mypoints',
    icon: CheckBadgeIcon,
  }
];

const linksAdmin = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  {
    name: 'Summary Report',
    href: '/dashboard/admin/summaryreport',
    icon: ArrowsPointingInIcon,
  },
  {
    name: 'Notifications',
    href: '/dashboard/admin/notifications',
    icon: BellAlertIcon,
  },
  {
    name: 'Assign Staff to Dept',
    href: '/dashboard/admin/assignstafftodept',
    icon: ArrowRightStartOnRectangleIcon,
  },
];

const linksHod = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  {
    name: 'Allocate Staff',
    href: '/dashboard/hod/allocatestaff',
    icon: ArrowRightStartOnRectangleIcon,
  },
  {
    name: 'De-allocate Staff',
    href: '/dashboard/hod/deallocatestaff',
    icon: ArrowLeftStartOnRectangleIcon,
  },
  {
    name: 'Points Report',
    href: '/dashboard/hod/pointsreport',
    icon: ChartBarSquareIcon,
  },
  {
    name: 'Master Report',
    href: '/dashboard/hod/masterreport',
    icon: CircleStackIcon,
  },
  {
    name: 'Summary Report',
    href: '/dashboard/hod/summaryreport',
    icon: ArrowsPointingInIcon,
  },
];

const linksStaff = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  {
    name: 'Alloted Students',
    href: '/dashboard/staff/allotedstudents',
    icon: CircleStackIcon,
  },
];

export default function NavLinks({ userrole } : { userrole: string }) {
  const pathname = usePathname();
  let links;
  userrole === 'student' ? links = linksStudent : userrole === 'hod' ? links = linksHod : userrole === 'staff' ? links = linksStaff : links = linksAdmin;
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-sky-100 text-blue-600': pathname === link.href,
              },
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
