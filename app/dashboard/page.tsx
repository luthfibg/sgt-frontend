'use client'

import React, { useState } from 'react'
import { Breadcrumb, Layout, theme } from 'antd';
import DashboardSider from '@/app/ui/dashboardSider';

const { Header, Content, Footer } = Layout;

const Page = () => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    return <h1>Welcome to the Dashboard!</h1>;
}

export default Page