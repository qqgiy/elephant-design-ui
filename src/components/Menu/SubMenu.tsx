import React, { useContext, FC, useState } from 'react';
import classNames from 'classnames';
// import { CSSTransition } from 'react-transition-group';
import { MenuContext } from './Menu';
import { MenuItemProps } from './MenuItem';
import Transition from '../Transition';
import Icon from '../Icon';

export interface SubMenuProps {
    index?: string;
    title: string;
    className?: string;
}

const SubMenu: FC<SubMenuProps> = ({ index, title, children, className }) => {
    const context = useContext(MenuContext);
    const openedSubMenus = context.defaultOpenSubMenus as Array<string>;
    const isOpend = index && context.mode === 'vertical' ? openedSubMenus.includes(index) : false;
    const [menuOpen, setOpen] = useState(isOpend);
    const classes = classNames('menu-item submenu-item', className, {
        'is-active': context.index === index,
        'is-opened': menuOpen,
        'is-vertical': context.mode === 'vertical',
    });
    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setOpen(!menuOpen);
    };
    let timer: any;
    const handleMouse = (e: React.MouseEvent, toggle: boolean) => {
        clearTimeout(timer);
        e.preventDefault();
        timer = setTimeout(() => {
            setOpen(toggle);
        }, 300);
    };
    const clickEvents =
        context.mode === 'vertical'
            ? {
                  onClick: handleClick,
              }
            : {};
    const hoverEvents =
        context.mode !== 'vertical'
            ? {
                  onMouseEnter: (e: React.MouseEvent) => {
                      handleMouse(e, true);
                  },
                  onMouseLeave: (e: React.MouseEvent) => {
                      handleMouse(e, false);
                  },
              }
            : {};

    const renderChildren = () => {
        const subMenuClasses = classNames('elephant-submenu', {
            'menu-opened': menuOpen,
        });
        const childrenComponent = React.Children.map(children, (child, i) => {
            const childElement = child as React.FunctionComponentElement<MenuItemProps>;
            const { displayName } = childElement.type;
            if (displayName === 'MenuItem') {
                // return child;
                return React.cloneElement(childElement, {
                    index: `${index}-${i}`,
                });
                // return childElement;
            } else {
                console.error('Warning: Menu has a child which is not a MenuItem component');
            }
        });
        return (
            <Transition in={menuOpen} timeout={300} animation='zoom-in-bottom'>
                <ul className={subMenuClasses}>{childrenComponent}</ul>
            </Transition>
        );
    };

    return (
        <li key={index} className={classes} {...hoverEvents}>
            <div className='submenu-title' {...clickEvents}>
                {title}
                <Icon icon='angle-down' className='arrow-icon' />
            </div>
            {renderChildren()}
        </li>
    );
};

SubMenu.displayName = 'SubMenu';
export default SubMenu;
