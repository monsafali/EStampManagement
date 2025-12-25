import React from "react";

const UserInfoPanel = ({ title, description, list }) => {
    return (
        <div className="user-right">
            <h2>{title}</h2>

            <p>{description}</p>

            {list?.length > 0 && (
                <>
                    <h3>What they can do:</h3>
                    <ul>
                        {list.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
};

export default UserInfoPanel;
