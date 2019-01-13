import * as React from "react";

export interface FooProps { framework: string; }

// 'FooProps' describes the shape of props.
// State is never set so we use the '{}' type.
export class Foo extends React.Component<FooProps, {}> {
    render() {
        return <h1>Hello from {this.props.framework}!</h1>;
    }
}
