import { NowRequest, NowResponse } from "@now/node";

module.exports = (req: NowRequest, res: NowResponse) => {
	res.status(200).json({ oh: "boy" });
};
