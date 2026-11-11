export function validateRequest(schema, source = "body") {
    console.log("reached validate Request")
    return (req, res, next) => {
        const result = schema.safeParse(req[source]);

        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: 'validation failed',
                errors: result.error.flatten(),
            });
        };

        req[source] = result.data;

        next();
    }
}