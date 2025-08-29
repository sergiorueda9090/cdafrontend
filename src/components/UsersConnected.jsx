import React, { useEffect, useState, useRef } from "react";
import AvatarGroup from '@mui/material/AvatarGroup';
import { Tooltip, Avatar } from "@mui/material";
import { styled } from '@mui/material/styles';
import { Badge } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { URLws } from "../constants.js/constantGlogal";
// Lista de colores únicos para los puntos de estado
const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#FFD700', '#00FFFF', '#FF4500', '#8A2BE2'];

// Estilos del punto de estado (Badge)
const StyledBadge = styled(Badge)(({ theme, statusColor }) => ({
    '& .MuiBadge-badge': {
        backgroundColor: statusColor,
        color: statusColor,
        width: 10,
        height: 10,
        borderRadius: '50%',
        border: `2px solid ${theme.palette.background.paper}`,
    },
}));

const scheme = window.location.protocol === "https:" ? "wss" : "ws";

export const UsersConnected = () => {
    const { token } = useSelector((state) => state.authStore);
    const [users, setUsers] = useState([]);


    useEffect(() => {

        let chatSocket;
        const roomName = "default"; // puedes cambiarlo dinámicamente

        function connect() {

            chatSocket = new WebSocket( `${scheme}://${URLws}/ws/chat/${roomName}/?token=${token}`);
    
            chatSocket.onopen = function () {
                console.log("✅ Successfully connected to WebSocket.");
            };

            chatSocket.onclose = function () {
                console.log("❌ WebSocket closed. Reconnecting in 2s...");
                setTimeout(connect, 2000);
            };

            chatSocket.onmessage = function (e) {
                const data = JSON.parse(e.data);
                switch (data.type) {
                case "user_list":
                    setUsers([...new Set(data.users)]);
                    break;
                case "user_join":
                    setUsers((prev) => {
                        // Evitar duplicados
                        if (prev.includes(data.user)) {
                        return prev;
                        }
                        return [...prev, data.user];
                    });
                    break;
                case "user_leave":
                    setUsers((prev) => prev.filter((u) => u !== data.user));
                    break;
                default:
                    console.warn("Unknown message type:", data.type);
                }
            };

            chatSocket.onerror = function (err) {
                console.error("⚠️ WebSocket error:", err.message);
                chatSocket.close();
            };
        }

        connect();

        return () => {
        if (chatSocket) chatSocket.close();
        };
    }, []);

    console.log("Users connected:", users);
    return (
                <AvatarGroup total={users.length}>
                {users.map((user, index) => (
                    <Tooltip key={index} title={user.username} arrow>
                    <StyledBadge
                        overlap="circular"
                        statusColor={colors[index % colors.length]}
                        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                        variant="dot"
                    >
                        <Avatar alt={user.username} src={user.image} />
                    </StyledBadge>
                    </Tooltip>
                ))}
                </AvatarGroup>
    )

}