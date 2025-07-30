'use client'

import React from 'react'
import {
    DesktopOutlined,
    FileOutlined,
    PieChartOutlined,
    TeamOutlined,
    UserOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu, Space, Flex } from 'antd';
import '@/public/images/logo/logo-sgtcs.png';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';


const { Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem('Dashboard', '/dashboard', <PieChartOutlined />),
  getItem('Product', '/dashboard/products', <DesktopOutlined />),
  getItem('Selling', 'sub1', <UserOutlined />, [
    getItem('Tom', '/dashboard/selling/tom'),
    getItem('Bill', '/dashboard/selling/bill'),
    getItem('Alex', '/dashboard/selling/alex'),
  ]),
  getItem('Team Selling', 'sub2', <TeamOutlined />, [getItem('Team 1', '/dashboard/selling/team1'), getItem('Team 2', '/dashboard/selling/team2')]),
  getItem('Files', '/dashboard/files', <FileOutlined />),
];

interface DashboardSiderProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
  defaultSelectedKeys?: string[];
}

const DashboardSider: React.FC<DashboardSiderProps> = ({
  collapsed,
  onCollapse,
  defaultSelectedKeys = ['1']
}) => {
    const pathname = usePathname();
    const router = useRouter();
    return (
        <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
        <Space className="logo-wrapper" size='small' direction='vertical' style={{  width: '100%' }}>
            {!collapsed && (
                <Flex justify='start' align='center' style={{ padding: '10px' }}>
                    <Image
                    src="/images/logo/logo-sgtcs.png"
                    alt="SGTCS Logo"
                    width={100}
                    height={20}
                    />
                </Flex>
            )}

            <Menu
                theme="dark"
                selectedKeys={[pathname]}
                mode="inline"
                items={items}
                onClick={({ key }) => {
                    router.push(key); // navigate to the route
                }}
            />
        </Space>
        </Sider>
    );
};

export default DashboardSider;