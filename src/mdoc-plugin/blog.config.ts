import { z } from "zod";

export const schema = z.object({
	title: z.string({
		required_error: "The post title must be provided",
		invalid_type_error: "The post title should be a string",
	}),
	description: z.string({
		required_error: "The post description must be provided",
		invalid_type_error: "The post description should be a string",
	}),
	published: z.date({
		required_error: "The post date must be provided",
		invalid_type_error:
			"The post date should be of the form YYYY-MM-DD or a ISO string",
	}),
	tags: z
		.array(z.string({ invalid_type_error: "The tag should be a string" }))
		.nonempty({
			message: "There should atleast be one tag for an article",
		}),
	cover: z.object({
		url: z.string({
			required_error: "The post picture url must be provided",
			invalid_type_error: "The post picture url must be a string",
		}),
		alt: z.string({
			required_error: "The post picture alt must be provided",
			invalid_type_error: "The post picture alt must be a string",
		}),
	}),
	draft: z.boolean().default(false),
});
