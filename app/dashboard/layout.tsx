'use client';

import React, { useState } from 'react';
import { Breadcrumb, Layout, theme } from 'antd';
import DashboardSider from '@/app/ui/dashboardSider';

const { Header, Content, Footer } = Layout;

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <DashboardSider
        collapsed={collapsed}
        onCollapse={setCollapsed}
      />
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb
            style={{ margin: '16px 0' }}
            items={[{ title: 'Dashboard' }]} // Optional: dynamic breadcrumb
          />
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {children} {/* 🔥 Ini kunci konten dinamis */}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Muhamad Luthfi ©{new Date().getFullYear()} Created by Next-Antd
        </Footer>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
