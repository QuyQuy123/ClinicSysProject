import React, { createContext, useContext, useState } from 'react';
const UserContext = createContext(null);
export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
export const UserProvider = ({ children }) => {
    const [userProfile, setUserProfile] = useState(null);
    const [userPreferences, setUserPreferences] = useState({});

    const updateProfile = (profileData) => {
        setUserProfile(profileData);
    };

    const updatePreferences = (preferences) => {
        setUserPreferences(prev => ({ ...prev, ...preferences }));
    };

    const value = {
        userProfile,
        userPreferences,
        updateProfile,
        updatePreferences
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;

