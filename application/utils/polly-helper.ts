import { PollyClient, StartSpeechSynthesisTaskCommand } from "@aws-sdk/client-polly";
import { AWSClientCredentials } from "application/entities/awsClientCredentials";


type generateAudioParams = {
    text: string,
    voiceMode: "neural" | "standard",
    languageCode: string,
    outputFormat: string,
    outputS3BucketName: string,
    outputS3KeyPrefix: string
}

export class PollyHelper {

    client: PollyClient

    constructor(region: string, credentials?: AWSClientCredentials) {
        this.client = new PollyClient({
            region,
            credentials
        });
    }

    async generateAudio(params: generateAudioParams) {
        const command = new StartSpeechSynthesisTaskCommand({
            OutputFormat: params.outputFormat,
            OutputS3BucketName: params.outputS3BucketName,
            Text: params.text,
            VoiceId: params.voiceMode === "neural" ? "Stephen" : "Joey",
            Engine: params.voiceMode,
            LanguageCode: params.languageCode,
            OutputS3KeyPrefix: params.outputS3KeyPrefix
        })

        const pollyResponse = await this.client.send(command)

        return pollyResponse.SynthesisTask?.TaskId
    }

}

