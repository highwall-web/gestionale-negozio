import { useRef, useState, useCallback } from "react";
import { ActionIcon, Group } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";

interface Props {
    value: number[];
    onChange: (value: number[]) => void;
    disabled?: boolean;
}

const SIZE = 240;
const PADDING = 48;
const STEP = (SIZE - PADDING * 2) / 2;
const DOT_RADIUS = 14;
const HIT_RADIUS = 24;

function getDotCenter(index: number) {
    const row = Math.floor(index / 3);
    const col = index % 3;
    return {
        x: PADDING + col * STEP,
        y: PADDING + row * STEP,
    };
}

export default function PatternLock({ value, onChange, disabled = false }: Props) {
    const [drawing, setDrawing] = useState(false);
    const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    const getSVGCoords = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        const svg = svgRef.current;
        if (!svg) return null;
        const rect = svg.getBoundingClientRect();
        const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
        const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
        return {
            x: (clientX - rect.left) * (SIZE / rect.width),
            y: (clientY - rect.top) * (SIZE / rect.height),
        };
    }, []);

    const getDotAtPos = useCallback((x: number, y: number) => {
        for (let i = 0; i < 9; i++) {
            const c = getDotCenter(i);
            if (Math.hypot(x - c.x, y - c.y) <= HIT_RADIUS) return i + 1;
        }
        return null;
    }, []);

    const handleStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        if (disabled) return;
        const pos = getSVGCoords(e);
        if (!pos) return;
        const dot = getDotAtPos(pos.x, pos.y);
        if (dot !== null) {
            onChange([dot]);
            setDrawing(true);
            setMousePos(pos);
        }
    }, [disabled, getSVGCoords, getDotAtPos, onChange]);

    const handleMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        if (!drawing) return;
        const pos = getSVGCoords(e);
        if (!pos) return;
        setMousePos(pos);
        const dot = getDotAtPos(pos.x, pos.y);
        if (dot !== null && !value.includes(dot)) {
            onChange([...value, dot]);
        }
    }, [drawing, getSVGCoords, getDotAtPos, value, onChange]);

    const handleEnd = useCallback(() => {
        setDrawing(false);
        setMousePos(null);
    }, []);

    const lastDot = value.length > 0 ? getDotCenter(value[value.length - 1] - 1) : null;

    return (
        <Group align="flex-end" gap={6}>
            <svg
                ref={svgRef}
                width={SIZE}
                height={SIZE}
                viewBox={`0 0 ${SIZE} ${SIZE}`}
                style={{
                    touchAction: "none",
                    userSelect: "none",
                    cursor: disabled ? "not-allowed" : drawing ? "crosshair" : "default",
                    opacity: disabled ? 0.5 : 1,
                    display: "block",
                    background: "var(--mantine-color-default)",
                    borderRadius: "var(--mantine-radius-sm)",
                    border: "1px solid var(--mantine-color-default-border)",
                }}
                onMouseDown={handleStart}
                onMouseMove={handleMove}
                onMouseUp={handleEnd}
                onMouseLeave={handleEnd}
                onTouchStart={handleStart}
                onTouchMove={handleMove}
                onTouchEnd={handleEnd}
            >
                {/* Linee tra i dot connessi */}
                {value.slice(0, -1).map((dotNum, i) => {
                    const from = getDotCenter(dotNum - 1);
                    const to = getDotCenter(value[i + 1] - 1);
                    return (
                        <line
                            key={i}
                            x1={from.x} y1={from.y}
                            x2={to.x} y2={to.y}
                            stroke="var(--mantine-color-blue-5)"
                            strokeWidth={3}
                            strokeLinecap="round"
                        />
                    );
                })}

                {/* Linea dal'ultimo dot al mouse */}
                {drawing && mousePos && lastDot && (
                    <line
                        x1={lastDot.x} y1={lastDot.y}
                        x2={mousePos.x} y2={mousePos.y}
                        stroke="var(--mantine-color-blue-5)"
                        strokeWidth={3}
                        strokeLinecap="round"
                        opacity={0.4}
                    />
                )}

                {/* Dot */}
                {Array.from({ length: 9 }, (_, i) => {
                    const { x, y } = getDotCenter(i);
                    const orderIndex = value.indexOf(i + 1);
                    const active = orderIndex !== -1;
                    return (
                        <g key={i}>
                            <circle
                                cx={x} cy={y} r={DOT_RADIUS}
                                fill={active ? "var(--mantine-color-blue-5)" : "var(--mantine-color-gray-5)"}
                                style={{ transition: "fill 0.1s" }}
                            />
                            {active && (
                                <text
                                    x={x} y={y}
                                    textAnchor="middle"
                                    dominantBaseline="central"
                                    fill="white"
                                    fontSize={11}
                                    fontWeight="bold"
                                    style={{ pointerEvents: "none" }}
                                >
                                    {orderIndex + 1}
                                </text>
                            )}
                        </g>
                    );
                })}
            </svg>
            {(value.length > 0 && !disabled) && (
                <ActionIcon
                    color="red"
                    variant="outline"
                    size="lg"
                    radius="sm"
                    onClick={() => onChange([])}
                >
                    <IconTrash size={18} />
                </ActionIcon>
            )}
        </Group>
    );
}
