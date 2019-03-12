import React, { Component } from 'react';

class Select extends Component {

    constructor(props) {
        super(props);

        this.state = {
            options: [],
            elems: [],
        };

        this.setInstance = this.setInstance.bind(this);
        this.destroyInstance = this.destroyInstance.bind(this);
    }
    
    componentDidMount() {
        const elems = document.querySelectorAll('select');
        this.setState({elems});
    }

    componentWillUnmount() {
        this.destroyInstance();
    }
    
    componentWillReceiveProps(nextProps) {        
        if(JSON.stringify(this.props.options) !== JSON.stringify(nextProps.options)) 
        {
            this.setState({options: nextProps.options}, () => {                
                this.setInstance();
            });
        }
    }

    setInstance() {
        if(this.props.type !== 'default' && this.state.options.length > 0) {
            window.M.FormSelect.init(this.state.elems);
        }
    }

    destroyInstance() {
        const {elems} = this.state;
        if(elems.length > 0) {
            elems.forEach(elem => {
                let instance = window.M.FormSelect.getInstance(elem);
                if(instance) {
                    instance.destroy();
                }
            });
        }
    }

    render() {
        let { 
            className, 
            selectClassName,
            name, 
            title,
            value, 
            onChangeHandler,
            label,
            required,
            type } = this.props;

        selectClassName = selectClassName || '';
        className = className || '';
        
        return (
            <div className={`input-field col ${className}`}>
                <select 
                    name={name} 
                    className={(type === 'default' ? 'browser-default ' : '') + selectClassName}
                    value={value} 
                    onChange={onChangeHandler} 
                    required={required}
                    >
                    <option value="" disabled>{title || 'Choose an option'}</option>
                    {              
                        this.state.options.map((option) => {
                            return <option value={option.value} key={option.value}>{option.title}</option>
                        })
                    }
                </select>
                {type !== 'default' ? <label>{label}</label> : null}
            </div>
        );
    }
}

export default Select;