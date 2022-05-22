import React from "react";
import { Button, Container, Menu } from "semantic-ui-react";

interface Props {
    createActivity: (id? : string) => void;
}

export default function NavBar(props: Props) {
    return (
        <Menu inverted fixed='top'>
            <Container>
                <Menu.Item header>
                    <img src="/assets/logo.png" alt="logo" style={{marginRight:'10px'}}/>
                    Reactivities
                </Menu.Item>
                <Menu.Item name="Activities"/>
                <Menu.Item>
                    <Button onClick={() => props.createActivity(undefined)} positive content='Create Activity'/>
                </Menu.Item>
            </Container>
        </Menu>
    )
}