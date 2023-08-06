import { PollyHelper } from 'application/utils/polly-helper';
import { Handler } from 'aws-lambda';

export const handler: Handler = async (event: any) => {
    console.log("Starting execution with event: ", JSON.stringify(event))

    const stringNarration = event.stringNarration
    const voiceMode = event.voiceMode
    const languageCode = event.languageCode

    const pollyHelper = new PollyHelper("us-east-1")

    const narrationId = await pollyHelper.generateAudio({
        languageCode,
        outputFormat: "mp3",
        outputS3BucketName: process.env.BUCKET,
        outputS3KeyPrefix: "narration/",
        text: stringNarration,
        voiceMode
    })

    console.log("narrationId: ", narrationId)

    return { narrationId }
}