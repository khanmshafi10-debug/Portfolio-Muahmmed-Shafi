import { IconButton, Tooltip } from '@mui/material';
import { CameraMode, useGameStore } from '../core/store/gameStore';
import PersonIcon from '@mui/icons-material/Person';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ThreeSixtyIcon from '@mui/icons-material/ThreeSixty';

export function SideBar() {
    const isMobile = useGameStore((state) => state.isMobile);
    
    const cameraMode = useGameStore((state) => state.cameraMode);
    const setCameraMode = useGameStore((state) => state.setCameraMode);

    const quality = useGameStore((state) => state.quality); 
    const toggleQuality = useGameStore((state) => state.toggleQuality); 

    const cycleCameraMode = () => {
        setCameraMode((cameraMode + 1) % 3);
    };

    const btnStyle = {
        background: 'linear-gradient(135deg, rgba(168,85,247,0.18) 0%, rgba(12,8,26,0.75) 100%)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderRadius: '12px',
        padding: isMobile ? '8px' : '11px',
        border: '1px solid rgba(168, 85, 247, 0.35)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.4), 0 0 15px rgba(168,85,247,0.15), inset 0 1px 0 rgba(255,255,255,0.15)',
        transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
        color: '#F8FAFC',

        '&:hover': {
            background: 'linear-gradient(135deg, rgba(168,85,247,0.38) 0%, rgba(20,12,42,0.9) 100%)',
            borderColor: 'rgba(168, 85, 247, 0.8)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.5), 0 0 25px rgba(168,85,247,0.5), inset 0 1px 0 rgba(255,255,255,0.3)',
            transform: 'scale(1.06)',
        },
    } as const;

    const iconBaseStyle = {
        fontSize: isMobile ? '20px' : '24px',
    };

    const qualityIconStyle = {
        ...iconBaseStyle,
        transition: 'color 0.3s ease, filter 0.3s ease',
        color: quality === 'high' ? '#C084FC' : 'rgba(248, 250, 252, 0.6)', 
        filter: quality === 'high' ? 'drop-shadow(0 0 8px rgba(192, 132, 252, 0.8))' : 'none',
    };


    const cameraConfig = {
        [CameraMode.Follow]: {
            icon: <PersonIcon sx={iconBaseStyle} />,
            title: "Third Person"
        },
        [CameraMode.FPV]: {
            icon: <VisibilityIcon sx={iconBaseStyle} />,
            title: "First Person"
        },
        [CameraMode.Detached]: {
            icon: <ThreeSixtyIcon sx={iconBaseStyle} />,
            title: "Tripod View"
        },
    };
    const currentCamera = cameraConfig[cameraMode];

    const qualityTooltip = quality === 'high' ? 'Quality' : 'Performance';


    return (
        <div style={{
            position: 'fixed',
            top: '10px',
            right: '10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            pointerEvents: 'auto',
            zIndex: 50,
        }}>
            
            <Tooltip title={ qualityTooltip } placement="left">
                <IconButton sx={btnStyle} onClick={toggleQuality}>
                    <AutoAwesomeIcon sx={qualityIconStyle} />
                </IconButton>
            </Tooltip>

            <Tooltip title={currentCamera.title} placement="left">
                <IconButton sx={btnStyle} onClick={cycleCameraMode}>
                    {currentCamera.icon}
                </IconButton>
            </Tooltip>
        </div>
    );
}