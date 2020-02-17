/**
 *
 *
 * @export
 * @abstract
 * @class Operator
 */
export abstract class Operator {

    /**
     *
     *
     * @static
     * @returns {string}
     * @memberof Operator
     */
    public static ToString(): string {
        return '';
    }

    /**
     *
     *
     * @static
     * @returns {boolean}
     * @memberof Operator
     */
    public static HasRightOperand(): boolean {
        return true;
    }

    /**
     *
     *
     * @static
     * @returns {string}
     * @memberof Operator
     */
    public static RightOperand(): string {
        return '?';
    }
}

/**
 *
 *
 * @class Like
 * @extends {Operator}
 */
class Like extends Operator {

    /**
     *
     *
     * @static
     * @returns {string}
     * @memberof Like
     */
    public static ToString(): string {
        return 'LIKE';
    }
}

/**
 *
 *
 * @class Eq
 * @extends {Operator}
 */
class Eq extends Operator {

    /**
     *
     *
     * @static
     * @returns {string}
     * @memberof Eq
     */
    public static ToString(): string {
        return '=';
    }
}


/**
 *
 *
 * @class Ne
 * @extends {Operator}
 */
class Ne extends Operator {
    /**
     *
     *
     * @static
     * @returns {string}
     * @memberof Ne
     */
    public static ToString(): string {
        return '<>';
    }
}
/**
 *
 *
 * @class Gt
 * @extends {Operator}
 */
class Gt extends Operator {
    /**
     *
     *
     * @static
     * @returns {string}
     * @memberof Gt
     */
    public static ToString(): string {
        return '>';
    }
}
/**
 *
 *
 * @class Lt
 * @extends {Operator}
 */
class Lt extends Operator {
    /**
     *
     *
     * @static
     * @returns {string}
     * @memberof Lt
     */
    public static ToString(): string {
        return '<';
    }
}
/**
 *
 *
 * @class Gte
 * @extends {Operator}
 */
class Gte extends Operator {
    /**
     *
     *
     * @static
     * @returns {string}
     * @memberof Gte
     */
    public static ToString(): string {
        return '>=';
    }
}
/**
 *
 *
 * @class Lte
 * @extends {Operator}
 */
class Lte extends Operator {
    /**
     *
     *
     * @static
     * @returns {string}
     * @memberof Lte
     */
    public static ToString(): string {
        return '<=';
    }
}
/**
 *
 *
 * @class IsNull
 * @extends {Operator}
 */
class IsNull extends Operator {
    /**
     *
     *
     * @static
     * @returns {string}
     * @memberof IsNull
     */
    public static ToString(): string {
        return 'IS NULL';
    }

    /**
     *
     *
     * @static
     * @returns {boolean}
     * @memberof IsNull
     */
    public static HasRightOperand(): boolean {
        return false;
    }

    /**
     *
     *
     * @static
     * @returns {string}
     * @memberof IsNull
     */
    public static RightOperand(): string {
        return '';
    }
}
/**
 *
 *
 * @class NotNull
 * @extends {Operator}
 */
class NotNull extends Operator {
    /**
     *
     *
     * @static
     * @returns {string}
     * @memberof NotNull
     */
    public static ToString(): string {
        return 'IS NOT NULL';
    }

    /**
     *
     *
     * @static
     * @returns {boolean}
     * @memberof NotNull
     */
    public static HasRightOperand(): boolean {
        return false;
    }

    /**
     *
     *
     * @static
     * @returns {string}
     * @memberof NotNull
     */
    public static RightOperand(): string {
        return '';
    }
}

/**
 *
 *
 * @class In
 * @extends {Operator}
 */
class In extends Operator {
    /**
     *
     *
     * @static
     * @returns {string}
     * @memberof In
     */
    public static ToString(): string {
        return 'IN';
    }

    /**
     *
     *
     * @static
     * @returns {string}
     * @memberof In
     */
    public static RightOperand(): string {
        return '(?)';
    }
}


export const Operators = Object.freeze({
    Like,
    In,
    Eq,
    Ne,
    Gt,
    Lt,
    Gte,
    Lte,
    IsNull,
    NotNull
});