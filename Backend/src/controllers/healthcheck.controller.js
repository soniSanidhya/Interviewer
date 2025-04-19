export const check = async (req, res) => {
  const { bodyData } = req.body;
  const { paramData } = req.params;
  const { queryParamData } = req.query;

  // console.log(bodyData, "  ", paramData, " ", queryParamData);

  if (!bodyData || !paramData || !queryParamData) {
    res.status(400).json({ message: "something went wrong" });
  }

  // console.log(req.user);

  res.status(200).json({ bodyData, paramData, queryParamData });
};
