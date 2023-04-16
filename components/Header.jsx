import React from "react";
import { Menu } from "semantic-ui-react";
import Link from "next/link";

const Header = () => {
    return (
        <Menu style={{ marginTop: "10px" }}>
            <Menu.Item></Menu.Item>
            <Link href="/" className="item">
                CrowdCoin
            </Link>

            <Menu.Menu position="right">
                <Link href="/" className="item">
                    Campaigns
                </Link>
                <Link href="/campaigns/new" className="item">
                    +
                </Link>
            </Menu.Menu>
        </Menu>
    );
};

export default Header;
