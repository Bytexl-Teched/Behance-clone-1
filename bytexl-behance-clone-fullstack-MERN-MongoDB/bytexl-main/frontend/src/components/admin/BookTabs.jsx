import React, { useState } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import BookForm from "./BookForm";
import ModifyBook from "./ModifyBook";

function BookTabs() {
    const [activeTab, setActiveTab] = useState(0);

    function handleChange(_, newValue) {
        setActiveTab(newValue);
    }

    return (
        <Box
            id="bookTabsContainer"
            sx={{
                margin: "auto",
                width: "100%",
            }}
        >
            <Tabs centered id="tabs" onChange={handleChange} value={activeTab}>
                <Tab
                    id="addBookTab"
                    label="Add Book"
                    sx={{
                        fontSize: 16,
                    }}
                />
                <Tab
                    id="modifyBookTab"
                    label="Modify Book"
                    sx={{
                        fontSize: 16,
                    }}
                />
            </Tabs>
            {
                (activeTab === 0) &&
                <TabPanel>
                    <BookForm />
                </TabPanel>
            }
            {
                (activeTab === 1) &&
                <TabPanel>
                    <ModifyBook />
                </TabPanel>
            }
        </Box>
    );
}

function TabPanel({ children }) {
    return (
        <Box
            id="tabPanelContainer"
            sx={{
                border: "1px solid #ccc",
                mt: 2,
                p: 3,
            }}
        >
            {children}
        </Box>
    );
}

export default BookTabs;
