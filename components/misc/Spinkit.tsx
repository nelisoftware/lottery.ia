import React from 'react';

type SpinKitProps = {
    type: 'plane' | 'chase' | 'bounce' | 'wave' | 'pulse' | 'flow' | 'swing' | 'circle'
        | 'circle-fade' | 'grid' | 'fold' | 'wander';
    dots?: number;
    size?: string;  // ex: "100px"; "60%" etc
    color?: string; // ex: "red", "#fff", "rgba(1, 1, 1, .5)", "var(--color-blue-400)" etc
};

const SpinKit: React.FC<SpinKitProps> = (props) => {
    const { size, color } = props;
    let style: Record<string, string> | undefined = undefined;

    if (size !== undefined || color !== undefined) {
        style = {};

        if (size !== undefined) {
            style['--sk-size'] = size;
        }
        if (color !== undefined) {
            style['--sk-color'] = color;
        }
    }

    const type = props.type;
    const dots = props.dots ?? 1;

    if (type === 'plane' || type === 'pulse') {
        return <_Parent name={'sk-' + type} style={style} />;
    }

    if (type === 'wave') {
        return (
            <_Parent name={'sk-' + type} style={style}>
                <_Children name="sk-wave-rect" count={dots} />
            </_Parent>
        );
    }

    if (type === 'grid' || type === 'fold' || type === 'wander') {
        return (
            <_Parent name={'sk-' + type} style={style}>
                <_Children name={`sk-${type}-cube`} count={dots} />
            </_Parent>
        );
    }

    return (
        <_Parent name={'sk-' + type} style={style}>
            <_Children name={`sk-${type}-dot`} count={dots} />
        </_Parent>
    );
};

const _Parent: React.FC<{
    name: string;
    children?: React.ReactNode;
    style?: Record<string, string>;
}> = ({ name, children, style }) => {
    return (
        <div className={name} style={style}>
            {children}
        </div>
    );
};

const _Children: React.FC<{ name: string; count: number }> = ({ name, count }) => {
    return (<>
        {Array.from({ length: count }).map((_, idx) => (
            <div key={idx} className={name}></div>
        ))}
    </>);
};

export default React.memo(SpinKit);
