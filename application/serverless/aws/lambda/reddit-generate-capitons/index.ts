import { Configuration, CreateTranscriptionResponse, OpenAIApi } from "openai"
import { Readable } from "stream"
import { S3Helper } from "application/utils/s3-helper"
import { Handler } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';

export const handler: Handler = async (event: any) => {
    console.log("Starting execution with event: ", JSON.stringify(event))

    const narrationId = event.narrationId

    const audioReadable = await getNarration(narrationId)

    const captions = await genareteCaptions(audioReadable)

    console.log("captions: ", captions)

    await putCaptions(captions)
};

async function putCaptions(captions: CreateTranscriptionResponse) {

    const helper = new S3Helper(process.env.REGION)

    const captionsId = uuidv4();

    await helper.putS3Object(process.env.BUCKET, `captions/${captionsId}.srt`, captions)

}

async function getNarration(narrationId: string): Promise<Readable> {

    const helper = new S3Helper(process.env.REGION)

    const object = await helper.getS3Object(process.env.BUCKET, `narration/${narrationId}.mp3`)

    console.log("getNarration response: ", object)

    return object.Body as Readable
}

async function genareteCaptions(audioReadable: any): Promise<CreateTranscriptionResponse> {

    const configuration = new Configuration({
        apiKey: process.env.API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    audioReadable.path = 'narration.mp3';

    const resp = await openai.createTranscription(
        audioReadable,
        "whisper-1",
        "",
        "srt"
    );

    return resp.data
}